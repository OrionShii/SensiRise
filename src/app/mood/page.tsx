
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMood } from "@/context/mood-context";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap } from "lucide-react";

export default function MoodPage() {
  const { mood, updateBpm } = useMood();
  const [bpmInput, setBpmInput] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bpmValue = parseInt(bpmInput, 10);
    if (!isNaN(bpmValue) && bpmValue > 0) {
      updateBpm(bpmValue);
      toast({
        title: "Mood Logged!",
        description: `Your BPM of ${bpmValue} has been recorded.`,
      });
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for BPM.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Log Your Mood</h1>
        <p className="text-muted-foreground">
          Enter your current heart rate (BPM) to classify your mood.
        </p>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Current Mood</CardTitle>
          <CardDescription>
            {mood
              ? `Based on your BPM, you seem to be feeling: ${mood.label}`
              : "Enter your BPM to see your current mood."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bpm">Enter BPM (Heart Rate)</Label>
              <Input
                id="bpm"
                type="number"
                value={bpmInput}
                onChange={(e) => setBpmInput(e.target.value)}
                placeholder="e.g., 75"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Log Mood
            </Button>
          </form>
        </CardContent>
        {mood && (
           <CardFooter className="flex-col items-center justify-center pt-6 border-t">
              <span className="text-6xl">{mood.emoji}</span>
              <p className="mt-2 text-2xl font-semibold">{mood.label}</p>
          </CardFooter>
        )}
      </Card>
      
      <Alert className="mt-8">
        <Zap className="h-4 w-4" />
        <AlertTitle>Coming Soon: Smartwatch Sync! ✨</AlertTitle>
        <AlertDescription>
          Seamless smartwatch integration for automatic mood detection based on your heart rate. No more manual input — just connect and feel the sync.
        </AlertDescription>
      </Alert>
    </div>
  );
}
