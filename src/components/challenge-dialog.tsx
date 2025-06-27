"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaceScanChallenge } from "@/components/face-scan-challenge";
import { RpsChallenge } from "@/components/rps-challenge";
import { MathChallenge } from "@/components/math-challenge";
import { ObjectChallenge } from "@/components/object-challenge";
import { Progress } from "@/components/ui/progress";

export type ChallengeStep = 'rps' | 'object' | 'math' | 'face';

type ChallengeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeComplete: () => void;
  challenges?: ChallengeStep[];
};

const challengeConfig: Record<ChallengeStep, { label: string; description: string; }> = {
  rps: {
    label: "Rock, Paper, Scissors",
    description: "Win a game of rock-paper-scissors to proceed.",
  },
  object: {
    label: "Object Hunt",
    description: "Find the requested object and show it to the camera.",
  },
  math: {
    label: "Math Quiz",
    description: "Solve a quick math problem.",
  },
  face: {
    label: "Awake Check",
    description: "Prove you're awake for the final step.",
  },
};

const defaultChallengeSequence: ChallengeStep[] = ['rps', 'object', 'math', 'face'];

export function ChallengeDialog({
  open,
  onOpenChange,
  onChallengeComplete,
  challenges = defaultChallengeSequence,
}: ChallengeDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
    }
  }, [open]);

  const handleStepComplete = () => {
    if (stepIndex < challenges.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onChallengeComplete();
    }
  };

  if (!open || challenges.length === 0 || !challenges[stepIndex]) {
    return null;
  }

  const currentStep = challenges[stepIndex];
  const currentChallengeInfo = challengeConfig[currentStep];
  const title = challenges.length > 1
      ? `Step ${stepIndex + 1} of ${challenges.length}: ${currentChallengeInfo.label}`
      : currentChallengeInfo.label;

  const description = currentChallengeInfo.description;
  const progressValue = ((stepIndex + 1) / challenges.length) * 100;

  const renderChallenge = () => {
    switch (currentStep) {
      case 'rps':
        return <RpsChallenge onChallengeComplete={handleStepComplete} />;
      case 'object':
        return <ObjectChallenge onChallengeComplete={handleStepComplete} />;
      case 'math':
        return <MathChallenge onChallengeComplete={handleStepComplete} />;
      case 'face':
        return <FaceScanChallenge onChallengeComplete={handleStepComplete} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Progress value={progressValue} className="w-full" />
        </div>
        <div>{renderChallenge()}</div>
      </DialogContent>
    </Dialog>
  );
}
