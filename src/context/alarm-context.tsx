
'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export type ChallengeType = 'none' | 'rps' | 'math' | 'face' | 'object';

export type Alarm = {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
  challenge: ChallengeType;
};

const mockAlarms: Alarm[] = [
  { id: '1', time: '07:00', enabled: true, label: 'Weekday Wake-up', challenge: 'rps' },
  { id: '2', time: '09:00', enabled: false, label: 'Weekend Morning', challenge: 'math' },
  { id: '3', time: '06:30', enabled: true, label: 'Early Bird', challenge: 'face' },
  { id: '4', time: '08:30', enabled: true, label: 'Find your keys!', challenge: 'object' },
];

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (alarmData: Omit<Alarm, 'id'>) => void;
  updateAlarm: (alarm: Alarm) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  ringingAlarm: Alarm | null;
  triggerAlarm: (alarm: Alarm) => void;
  stopRinging: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  triggeredAlarms: Set<string>;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: ReactNode }) {
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [triggeredAlarms, setTriggeredAlarms] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const addAlarm = useCallback((alarmData: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString(),
    };
    setAlarms(prev => [...prev, newAlarm]);
  }, []);

  const updateAlarm = useCallback((updatedAlarm: Alarm) => {
    setAlarms(prev => prev.map(a => (a.id === updatedAlarm.id ? updatedAlarm : a)));
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }, []);

  const triggerAlarm = useCallback((alarm: Alarm) => {
    if (ringingAlarm) return;
    setRingingAlarm(alarm);
    const today = new Date().toLocaleDateString();
    setTriggeredAlarms(prev => new Set(prev).add(`${alarm.id}-${today}`));
  }, [ringingAlarm]);

  const stopRinging = useCallback(() => {
    if (ringingAlarm) {
      toast({
        title: "Alarm Deactivated!",
        description: "You have successfully completed the challenge.",
      });
      // Disable the alarm that just rang
      setAlarms(prev => prev.map(a => (a.id === ringingAlarm.id ? { ...a, enabled: false } : a)));
      setRingingAlarm(null);
    }
  }, [ringingAlarm, toast]);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
        setTriggeredAlarms(new Set());
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const contextValue = useMemo(() => ({
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    ringingAlarm,
    triggerAlarm,
    stopRinging,
    audioRef,
    triggeredAlarms
  }), [alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, ringingAlarm, triggerAlarm, stopRinging, audioRef, triggeredAlarms]);


  return <AlarmContext.Provider value={contextValue}>{children}</AlarmContext.Provider>;
}

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
}
