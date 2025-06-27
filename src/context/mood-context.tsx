
'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export type Mood = {
  emoji: string;
  label: string;
};

interface MoodContextType {
  bpm: number | null;
  mood: Mood | null;
  updateBpm: (newBpm: number) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [bpm, setBpm] = useState<number | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const classifyMood = (currentBpm: number): Mood => {
    if (currentBpm < 60) {
      return { emoji: "😴", label: "Sleepy" };
    }
    if (currentBpm <= 90) {
      return { emoji: "🙂", label: "Normal" };
    }
    return { emoji: "😬", label: "Stressed" };
  };

  const updateBpm = useCallback((newBpm: number) => {
    setBpm(newBpm);
    const newMood = classifyMood(newBpm);
    setMood(newMood);
  }, []);

  const contextValue = useMemo(() => ({
    bpm,
    mood,
    updateBpm,
  }), [bpm, mood, updateBpm]);

  return <MoodContext.Provider value={contextValue}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
