
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoodPage() {
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
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Check back later!</p>
        </CardContent>
      </Card>
    </div>
  );
}
