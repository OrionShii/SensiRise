
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, PlusCircle, Gamepad2, BrainCircuit, ScanFace, ScanSearch, Play } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChallengeDialog, ChallengeStep } from "@/components/challenge-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAlarm, type Alarm, type ChallengeType } from '@/context/alarm-context';

const challengeConfig: Record<ChallengeType, { label: string; icon?: React.ElementType }> = {
  none: { label: "No Challenge" },
  rps: { label: "Rock, Paper, Scissors", icon: Gamepad2 },
  math: { label: "Math Question", icon: BrainCircuit },
  face: { label: "Awake Check", icon: ScanFace },
  object: { label: "Object Hunt", icon: ScanSearch },
};

export default function AlarmPage() {
  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm } = useAlarm();
  
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('New Alarm');
  const [newAlarmChallenge, setNewAlarmChallenge] = useState<ChallengeType>('rps');

  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeStep | null>(null);
  const [challengingAlarmId, setChallengingAlarmId] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  const handleAddAlarm = () => {
    if (newAlarmTime) {
      addAlarm({
        time: newAlarmTime,
        label: newAlarmLabel || 'Alarm',
        challenge: newAlarmChallenge,
        enabled: true,
      });
      setNewAlarmTime('08:00');
      setNewAlarmLabel('New Alarm');
      setNewAlarmChallenge('rps');
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
    toast({
      title: "Challenge Test Complete!",
      description: "You have successfully completed the test.",
    });
    setChallengingAlarmId(null);
    setActiveChallenge(null);
  };


  const handleOpenEditDialog = (alarm: Alarm) => {
    setEditingAlarm({ ...alarm });
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (editingAlarm) {
      updateAlarm(editingAlarm);
      toast({
        title: "Alarm Updated",
        description: "Your alarm settings have been successfully saved.",
      });
      setIsEditDialogOpen(false);
      setEditingAlarm(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alarms</h1>
        <p className="text-muted-foreground">
          Manage your alarms and their deactivation challenges.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Alarms</CardTitle>
          <CardDescription>View, edit, and test your alarms.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alarms.map((alarm, index) => {
              const ChallengeIcon = challengeConfig[alarm.challenge]?.icon;
              return (
              <div key={alarm.id}>
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between py-4 rounded-lg -mx-2 px-2 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold font-mono ${!alarm.enabled && 'text-muted-foreground/50 line-through'}`}>
                      {alarm.time}
                    </span>
                    <div>
                      <p className={`font-medium ${!alarm.enabled && 'text-muted-foreground/80'}`}>{alarm.label}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {ChallengeIcon && <ChallengeIcon className="h-4 w-4" />}
                          <span>{challengeConfig[alarm.challenge]?.label || 'No Challenge'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      id={`alarm-switch-${alarm.id}`}
                      checked={alarm.enabled}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
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
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90" onClick={() => deleteAlarm(alarm.id)}>
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete Alarm</span>
                    </Button>
                  </div>
                </div>
              </div>
            )})}
             {alarms.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <p>You have no alarms set.</p>
                <p className="text-sm">Add one below to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
            <CardTitle>Add New Alarm</CardTitle>
            <CardDescription>Create a new alarm with a specific time, label, and challenge.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-alarm-time">Time</Label>
                <Input 
                  id="new-alarm-time"
                  type="time" 
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-alarm-label">Label</Label>
                <Input
                  id="new-alarm-label"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  placeholder="e.g. Weekday Wake-up"
                />
              </div>
              <div className="space-y-2">
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
        </CardContent>
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
              <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
