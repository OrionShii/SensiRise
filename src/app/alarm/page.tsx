"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, PlusCircle, Gamepad2, BrainCircuit, ScanFace, ScanSearch, Play } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChallengeDialog, ChallengeStep } from "@/components/challenge-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type ChallengeType = 'none' | 'rps' | 'math' | 'face' | 'object';

const challengeConfig: Record<ChallengeType, { label: string; icon?: React.ElementType }> = {
  none: { label: "No Challenge" },
  rps: { label: "Rock, Paper, Scissors", icon: Gamepad2 },
  math: { label: "Math Question", icon: BrainCircuit },
  face: { label: "Awake Check", icon: ScanFace },
  object: { label: "Object Hunt", icon: ScanSearch },
};

type Alarm = {
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

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('New Alarm');
  const [newAlarmChallenge, setNewAlarmChallenge] = useState<ChallengeType>('rps');

  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeStep | null>(null);
  const [challengingAlarmId, setChallengingAlarmId] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  const handleToggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };
  
  const handleAddAlarm = () => {
    if (newAlarmTime) {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: newAlarmTime,
        enabled: true,
        label: newAlarmLabel,
        challenge: newAlarmChallenge,
      };
      setAlarms([...alarms, newAlarm]);
      setNewAlarmLabel('New Alarm');
    }
  };

  const handleTriggerChallenge = (alarmId: string, challenge: ChallengeType) => {
    if (challenge === 'none') {
      toast({
        title: "No Challenge",
        description: "This alarm has no challenge to test.",
      });
      return;
    }
    setChallengingAlarmId(alarmId);
    setActiveChallenge(challenge as ChallengeStep);
    setIsChallengeActive(true);
  };

  const handleChallengeComplete = () => {
    setIsChallengeActive(false);
    if (challengingAlarmId) {
      setAlarms(
        alarms.map((alarm) =>
          alarm.id === challengingAlarmId ? { ...alarm, enabled: false } : alarm
        )
      );
      toast({
        title: "Alarm Deactivated!",
        description: "You have successfully completed the challenge.",
      });
      setChallengingAlarmId(null);
      setActiveChallenge(null);
    }
  };

  const handleOpenEditDialog = (alarm: Alarm) => {
    setEditingAlarm({ ...alarm });
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (editingAlarm) {
      setAlarms(
        alarms.map((alarm) =>
          alarm.id === editingAlarm.id ? editingAlarm : alarm
        )
      );
      toast({
        title: "Alarm Updated",
        description: "Your alarm settings have been successfully saved.",
      });
      setIsEditDialogOpen(false);
      setEditingAlarm(null);
    }
  };


  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alarms</h1>
        <p className="text-muted-foreground">
          Manage your alarms and their deactivation challenges.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Alarms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alarms.map((alarm, index) => {
              const ChallengeIcon = challengeConfig[alarm.challenge]?.icon;
              return (
              <div key={alarm.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold font-mono ${!alarm.enabled && 'text-muted-foreground'}`}>
                      {alarm.time}
                    </span>
                    <div>
                      <p className={`font-medium ${!alarm.enabled && 'text-muted-foreground'}`}>{alarm.label}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {ChallengeIcon && <ChallengeIcon className="h-4 w-4" />}
                          <span>{challengeConfig[alarm.challenge]?.label || 'No Challenge'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`alarm-switch-${alarm.id}`}
                      checked={alarm.enabled}
                      onCheckedChange={() => handleToggleAlarm(alarm.id)}
                      aria-label={`Toggle alarm for ${alarm.time}`}
                    />
                     <Button variant="ghost" size="icon" onClick={() => handleTriggerChallenge(alarm.id, alarm.challenge)} title="Test Challenge">
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Test Challenge</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(alarm)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Alarm</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteAlarm(alarm.id)}>
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete Alarm</span>
                    </Button>
                  </div>
                </div>
                {index < alarms.length - 1 && <Separator className="mt-4" />}
              </div>
            )})}
             {alarms.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                You have no alarms set.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
            <h3 className="font-semibold">Add New Alarm</h3>
            <div className="grid w-full grid-cols-1 md:grid-cols-4 items-end gap-4">
              <div className="space-y-1">
                <Label htmlFor="new-alarm-time">Alarm time</Label>
                <Input 
                  id="new-alarm-time"
                  type="time" 
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-alarm-label">Label</Label>
                <Input
                  id="new-alarm-label"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  placeholder="e.g. Weekday Wake-up"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-alarm-challenge">Challenge</Label>
                <Select
                  value={newAlarmChallenge}
                  onValueChange={(value) => setNewAlarmChallenge(value as ChallengeType)}
                >
                  <SelectTrigger id="new-alarm-challenge">
                    <SelectValue placeholder="Select a challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(challengeConfig) as ChallengeType[]).map((key) => {
                      const ChallengeIcon = challengeConfig[key].icon;
                      return (
                        <SelectItem key={key} value={key}>
                           <div className="flex items-center gap-2">
                             {ChallengeIcon && <ChallengeIcon className="h-4 w-4 text-muted-foreground" />}
                             <span>{challengeConfig[key].label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddAlarm} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4"/> Add Alarm
              </Button>
            </div>
        </CardFooter>
      </Card>
      
      <ChallengeDialog
        open={isChallengeActive}
        onOpenChange={setIsChallengeActive}
        onChallengeComplete={handleChallengeComplete}
        challenges={activeChallenge ? [activeChallenge] : []}
      />

      {editingAlarm && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Alarm</DialogTitle>
              <DialogDescription>
                Make changes to your alarm here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">
                  Time
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingAlarm.time}
                  onChange={(e) => setEditingAlarm({ ...editingAlarm, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-label" className="text-right">
                  Label
                </Label>
                <Input
                  id="edit-label"
                  value={editingAlarm.label}
                  onChange={(e) => setEditingAlarm({ ...editingAlarm, label: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-challenge" className="text-right">
                  Challenge
                </Label>
                <Select
                  value={editingAlarm.challenge}
                  onValueChange={(value) => setEditingAlarm({ ...editingAlarm, challenge: value as ChallengeType })}
                >
                  <SelectTrigger id="edit-challenge" className="col-span-3">
                    <SelectValue placeholder="Select a challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(challengeConfig) as ChallengeType[]).map((key) => {
                      const ChallengeIcon = challengeConfig[key].icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {ChallengeIcon && <ChallengeIcon className="h-4 w-4 text-muted-foreground" />}
                            <span>{challengeConfig[key].label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
