
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Bell, Gamepad2, BrainCircuit, ScanFace, ScanSearch, Smile } from "lucide-react";
import { useAlarm, type ChallengeType } from "@/context/alarm-context";
import { useMood } from "@/context/mood-context";

const challengeConfig: Record<ChallengeType, { label: string; icon?: React.ElementType }> = {
  none: { label: "No Challenge" },
  rps: { label: "Rock, Paper, Scissors", icon: Gamepad2 },
  math: { label: "Math Question", icon: BrainCircuit },
  face: { label: "Awake Check", icon: ScanFace },
  object: { label: "Object Hunt", icon: ScanSearch },
};


export default function HomePage() {
  const { alarms } = useAlarm();
  const { mood } = useMood();
  const userName = "Alex";

  const upcomingAlarms = alarms
    .filter((alarm) => alarm.enabled)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
      <div className="container mx-auto">
        <div className="flex flex-col items-start gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {userName}!</h1>
          <p className="text-muted-foreground">
            Here's your summary for today.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                  <CardTitle>Upcoming Alarms</CardTitle>
                  <CardDescription>Your scheduled wake-up calls.</CardDescription>
              </div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              {upcomingAlarms.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAlarms.map((alarm, index) => {
                    const ChallengeIcon = challengeConfig[alarm.challenge]?.icon;
                    return (
                      <div key={alarm.id}>
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold font-mono text-primary">
                                {alarm.time}
                                </span>
                                <div>
                                    <p className="font-medium">{alarm.label}</p>
                                    <p className="text-sm text-muted-foreground">{challengeConfig[alarm.challenge].label}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                {ChallengeIcon && <ChallengeIcon className="h-5 w-5" />}
                            </div>
                        </div>
                        {index < upcomingAlarms.length - 1 && <Separator className="mt-4" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center py-10 rounded-lg bg-muted/50 my-4">
                  <Bell className="w-12 h-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-muted-foreground">No alarms scheduled</p>
                  <p className="text-xs text-muted-foreground">Enjoy your sleep!</p>
                </div>
              )}
            </CardContent>
             <CardFooter>
               <Button asChild className="w-full">
                  <Link href="/alarm">
                      <PlusCircle className="mr-2 h-4 w-4"/> Add New Alarm
                  </Link>
               </Button>
             </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <div className="space-y-1">
                  <CardTitle>Today's Mood</CardTitle>
                  <CardDescription>How you're feeling today.</CardDescription>
              </div>
               <Smile className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              {mood ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-10 rounded-lg bg-muted/50 my-4">
                  <span className="text-6xl">{mood.emoji}</span>
                  <p className="mt-4 text-xl font-semibold">{mood.label}</p>
                </div>
              ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center py-10 rounded-lg bg-muted/50 my-4">
                    <Smile className="w-12 h-12 text-muted-foreground/50" />
                    <p className="mt-4 font-medium text-muted-foreground">No mood data yet.</p>
                      <Button asChild variant="link" className="mt-2">
                        <Link href="/mood">Log your mood</Link>
                      </Button>
                </div>
              )}
            </CardContent>
             <CardFooter>
               <Button asChild className="w-full" variant="outline">
                  <Link href="/mood">
                      View Mood History
                  </Link>
               </Button>
             </CardFooter>
          </Card>
        </div>
      </div>
  );
}
