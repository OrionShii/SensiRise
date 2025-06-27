"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

type Alarm = {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
};

const mockAlarms: Alarm[] = [
  { id: '1', time: '07:00', enabled: true, label: 'Weekday Wake-up' },
  { id: '2', time: '09:00', enabled: false, label: 'Weekend Morning' },
];

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');

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
        label: 'New Alarm'
      };
      setAlarms([...alarms, newAlarm]);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alarms</h1>
        <p className="text-muted-foreground">
          Manage your alarms here. The challenges will trigger when an active alarm goes off.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Alarms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alarms.map((alarm, index) => (
              <div key={alarm.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold font-mono ${!alarm.enabled && 'text-muted-foreground'}`}>
                      {alarm.time}
                    </span>
                    <div>
                      <p className={`font-medium ${!alarm.enabled && 'text-muted-foreground'}`}>{alarm.label}</p>
                      <p className="text-sm text-muted-foreground">Everyday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`alarm-switch-${alarm.id}`}
                      checked={alarm.enabled}
                      onCheckedChange={() => handleToggleAlarm(alarm.id)}
                      aria-label={`Toggle alarm for ${alarm.time}`}
                    />
                    <Button variant="ghost" size="icon">
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
            ))}
             {alarms.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                You have no alarms set.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
            <h3 className="font-semibold">Add New Alarm</h3>
            <div className="flex w-full items-center gap-2">
              <Label htmlFor="new-alarm-time" className="sr-only">Alarm time</Label>
              <Input 
                id="new-alarm-time"
                type="time" 
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)} 
                className="w-48"
              />
              <Button onClick={handleAddAlarm}>
                <PlusCircle className="mr-2 h-4 w-4"/> Add Alarm
              </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
