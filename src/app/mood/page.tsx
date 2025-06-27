"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Mood = {
  emoji: string;
  label: string;
};

const moods: Mood[] = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😊", label: "Content" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😠", label: "Angry" },
];

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(moods[1]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mood</h1>
        <p className="text-muted-foreground">
          How are you feeling today?
        </p>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Log Your Mood</CardTitle>
          <CardDescription>
            {selectedMood
              ? `Today you're feeling: ${selectedMood.label}`
              : "Select your current mood below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4 sm:gap-8 py-8">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                className={`flex flex-col items-center gap-2 p-4 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  selectedMood?.label === mood.label
                    ? "bg-primary/20 scale-110"
                    : "bg-muted/50"
                }`}
                aria-label={`Select ${mood.label} mood`}
              >
                <span className="text-4xl sm:text-5xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
