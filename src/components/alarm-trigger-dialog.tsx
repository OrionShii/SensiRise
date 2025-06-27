
"use client";

import { useEffect } from 'react';
import { useAlarm } from '@/context/alarm-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlarmClock } from 'lucide-react';
import { FaceScanChallenge } from "@/components/face-scan-challenge";
import { RpsChallenge } from "@/components/rps-challenge";
import { MathChallenge } from "@/components/math-challenge";
import { ObjectChallenge } from "@/components/object-challenge";

export function AlarmTriggerDialog() {
  const { ringingAlarm, stopRinging, audioRef } = useAlarm();

  useEffect(() => {
    const audio = audioRef.current;
    if (ringingAlarm && audio) {
      audio.src = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
      audio.loop = true;
      audio.play().catch(e => console.error("Audio playback failed:", e));
    } else if (audio && !audio.paused) {
      audio.pause();
    }

    return () => {
      if (audio && !audio.paused) {
        audio.pause();
      }
    };
  }, [ringingAlarm, audioRef]);

  const handleChallengeComplete = () => {
    stopRinging();
  };

  const isOpen = !!ringingAlarm;
  if (!isOpen) return null;

  const challenge = ringingAlarm.challenge;

  const renderChallenge = () => {
    switch (challenge) {
      case 'rps':
        return <RpsChallenge onChallengeComplete={handleChallengeComplete} />;
      case 'object':
        return <ObjectChallenge onChallengeComplete={handleChallengeComplete} />;
      case 'math':
        return <MathChallenge onChallengeComplete={handleChallengeComplete} />;
      case 'face':
        return <FaceScanChallenge onChallengeComplete={handleChallengeComplete} />;
      case 'none':
      default:
        return (
          <div className="p-4 pt-0 text-center flex flex-col items-center gap-4">
            <p className="text-muted-foreground">This alarm has no challenge. Just dismiss it to stop the ringtone.</p>
            <Button onClick={handleChallengeComplete} className="w-full">Dismiss Alarm</Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[480px] [&>button]:hidden" // Hide the default close 'X' button
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <AlarmClock className="mx-auto h-12 w-12 text-primary" />
          <DialogTitle className="text-3xl font-bold">Wake Up!</DialogTitle>
          <DialogDescription className="text-lg">
            It's time for your {ringingAlarm.time} alarm: "{ringingAlarm.label}"
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
            {renderChallenge()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
