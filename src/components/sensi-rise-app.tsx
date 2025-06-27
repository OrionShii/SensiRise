"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Sun } from "lucide-react";
import { ChallengeDialog } from "@/components/challenge-dialog";
import { useToast } from "@/hooks/use-toast";

export default function SensiRiseApp() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [alarmTime, setAlarmTime] = useState("07:00");
  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAlarmOn && !isAlarmRinging && currentTime) {
      const [hours, minutes] = alarmTime.split(":");
      
      if (
        currentTime.getHours() === parseInt(hours, 10) &&
        currentTime.getMinutes() === parseInt(minutes, 10) &&
        currentTime.getSeconds() === 0
      ) {
        setIsAlarmRinging(true);
      }
    }
  }, [currentTime, alarmTime, isAlarmOn, isAlarmRinging]);

  const handleAlarmDeactivated = () => {
    setIsAlarmRinging(false);
    setIsAlarmOn(false);
    toast({
      title: "Alarm Deactivated!",
      description: "You can now start your day. Have a great one!",
    });
  };

  const formattedTime = currentTime 
    ? currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  return (
    <>
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 text-primary">
            <Sun className="w-8 h-8" suppressHydrationWarning />
            <CardTitle className="text-4xl font-headline">SensiRise</CardTitle>
          </div>
          <p className="text-muted-foreground pt-2">
            Your intelligent alarm to rise and shine.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            <div className="text-7xl md:text-8xl font-bold text-foreground font-mono tracking-tighter">
              {isMounted ? formattedTime : "--:--"}
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-background w-full justify-between">
              <div className="flex flex-col">
                <Label htmlFor="alarm-time" className="text-lg font-semibold">
                  Alarm
                </Label>
                <input
                  id="alarm-time"
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 w-36"
                  disabled={isAlarmOn}
                  suppressHydrationWarning
                />
              </div>
              <div className="flex items-center space-x-2">
                {isAlarmOn ? (
                  <Bell className="w-6 h-6 text-accent" suppressHydrationWarning />
                ) : (
                  <BellOff className="w-6 h-6 text-muted-foreground" suppressHydrationWarning />
                )}
                <Switch
                  id="alarm-toggle"
                  checked={isAlarmOn}
                  onCheckedChange={setIsAlarmOn}
                  aria-label="Toggle alarm"
                  suppressHydrationWarning
                />
              </div>
            </div>
            <Button
              onClick={() => setIsAlarmRinging(true)}
              className="w-full"
              size="lg"
              suppressHydrationWarning
            >
              Test Deactivation Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
      <ChallengeDialog
        open={isAlarmRinging}
        onOpenChange={setIsAlarmRinging}
        onChallengeComplete={handleAlarmDeactivated}
      />
    </>
  );
}
