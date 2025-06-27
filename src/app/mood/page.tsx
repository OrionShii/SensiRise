
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
      setBpmInput("");
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for BPM.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Log Your Mood</h1>
        <p className="text-muted-foreground">
          Manually enter your heart rate (BPM) to get a mood snapshot.
        </p>
      </div>
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Log Heart Rate</CardTitle>
          <CardDescription>
            {mood
              ? `Your last recorded mood was: ${mood.label}`
              : "Enter your BPM to classify your current mood."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bpm">Current BPM (beats per minute)</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={bpmInput}
                  onChange={(e) => setBpmInput(e.target.value)}
                  placeholder="e.g., 75"
                  required
                />
              </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" className="w-full md:w-auto">
              Log Mood
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {mood && (
        <Card className="transition-all duration-300 hover:shadow-lg">
           <CardHeader>
              <CardTitle>Current Mood Analysis</CardTitle>
           </CardHeader>
           <CardContent className="flex flex-col items-center justify-center pt-6 text-center">
              <span className="text-7xl">{mood.emoji}</span>
              <p className="mt-4 text-3xl font-bold">{mood.label}</p>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Zap className="h-4 w-4" />
        <AlertTitle>Coming Soon: Smartwatch Sync!</AlertTitle>
        <AlertDescription>
          Seamless smartwatch integration for automatic mood detection based on your heart rate. No more manual input — just connect and feel the sync.
        </AlertDescription>
      </Alert>
    </div>
  );
}
