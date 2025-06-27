
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlarmClock, Music, Smile, User } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome to SensiRise
        </h1>
        <p className="text-lg text-muted-foreground">
          Your intelligent dashboard to rise and shine. Navigate using the sidebar.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alarm</CardTitle>
            <AlarmClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">07:00 AM</div>
            <p className="text-xs text-muted-foreground">Next alarm is set</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ringtone</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Morning Dew</div>
            <p className="text-xs text-muted-foreground">Currently selected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Refreshed</div>
            <p className="text-xs text-muted-foreground">Ready for the day!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <Button asChild className="mt-2">
                <Link href="/profile">View Profile</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
