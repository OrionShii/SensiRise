
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, AlarmClock, Music, Smile, User, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useEffect } from "react";
import { useAlarm } from "@/context/alarm-context";
import { AlarmTriggerDialog } from "./alarm-trigger-dialog";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/alarm", label: "Alarms", icon: AlarmClock },
  { href: "/ringtone", label: "Ringtone", icon: Music },
  { href: "/mood", label: "Mood", icon: Smile },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { alarms, triggerAlarm, triggeredAlarms, audioRef } = useAlarm();

  // Real-time alarm checker
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toLocaleDateString();

      for (const alarm of alarms) {
        if (alarm.enabled && alarm.time === currentTime) {
          const triggeredKey = `${alarm.id}-${today}`;
          if (!triggeredAlarms.has(triggeredKey)) {
            triggerAlarm(alarm);
            break; // Trigger only the first matching alarm
          }
        }
      }
    };

    // Check every second
    const intervalId = setInterval(checkAlarms, 1000);

    return () => clearInterval(intervalId);
  }, [alarms, triggerAlarm, triggeredAlarms]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-primary">
              <Wind className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-primary">SensiRise</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content can go here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
      <audio ref={audioRef} />
      <AlarmTriggerDialog />
    </SidebarProvider>
  );
}
