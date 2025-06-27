
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, CheckCircle2, Pause } from "lucide-react";

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
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayToggle = (ringtone: Ringtone) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // If clicking the currently playing ringtone, pause it
    if (playingUrl === ringtone.url) {
      audio.pause();
      setPlayingUrl(null);
    } else {
      // Pause any current audio before playing a new one
      if (!audio.paused) {
        audio.pause();
      }
      audio.src = ringtone.url;
      audio.play().catch(e => console.error("Audio playback failed:", e));
      setPlayingUrl(ringtone.url);
    }
  };
  
  // Listen for when audio finishes playing to reset the state
  const onAudioEnded = () => {
    setPlayingUrl(null);
  };

  const handleSetActive = (id: string) => {
    setActiveRingtoneId(id);
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingUrl(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <audio ref={audioRef} onEnded={onAudioEnded} />
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ringtones</h1>
        <p className="text-muted-foreground">
          Choose the sound that wakes you up. The active ringtone will be used for all alarms.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select a Ringtone</CardTitle>
          <CardDescription>Preview sounds and set your preferred alarm tone.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockRingtones.map((ringtone, index) => (
              <div key={ringtone.id}>
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">{ringtone.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlayToggle(ringtone)}
                      aria-label={`Play ${ringtone.name}`}
                    >
                      {playingUrl === ringtone.url ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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
                        'Set Active'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
