
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, CheckCircle2 } from "lucide-react";

type Ringtone = {
  id: string;
  name: string;
  url: string;
};

const mockRingtones: Ringtone[] = [
  { id: '1', name: 'Alarm Clock', url: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
  { id: '2', name: 'Digital Watch', url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
  { id: '3', name: 'Buzzer', url: 'https://actions.google.com/sounds/v1/alarms/buzzer.ogg' },
  { id: '4', name: 'Robot Chime', url: 'https://actions.google.com/sounds/v1/alarms/robot_chime.ogg' },
  { id: '5', name: 'Morning Dew', url: 'https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg'},
];

export default function RingtonePage() {
  const [activeRingtoneId, setActiveRingtoneId] = useState<string>('1');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // If the clicked ringtone is already playing, pause it.
    if (audio.src === url && !audio.paused) {
      audio.pause();
    } else {
      // Otherwise, play the new ringtone.
      // Crucially, pause any existing audio first to prevent interruption errors.
      if (!audio.paused) {
        audio.pause();
      }
      audio.src = url;
      audio.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  const handleSetActive = (id: string) => {
    setActiveRingtoneId(id);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return (
    <div>
      <audio ref={audioRef} />
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ringtones</h1>
        <p className="text-muted-foreground">
          Choose your alarm sound.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Select a Ringtone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockRingtones.map((ringtone, index) => (
              <div key={ringtone.id}>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">{ringtone.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlay(ringtone.url)}
                      aria-label={`Play ${ringtone.name}`}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleSetActive(ringtone.id)}
                      disabled={activeRingtoneId === ringtone.id}
                      className="w-36"
                      variant={activeRingtoneId === ringtone.id ? "secondary" : "default"}
                    >
                      {activeRingtoneId === ringtone.id ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Active
                        </>
                      ) : (
                        'Set as Active'
                      )}
                    </Button>
                  </div>
                </div>
                {index < mockRingtones.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    