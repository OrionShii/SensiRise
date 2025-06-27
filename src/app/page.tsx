
import SensiRiseApp from "@/components/sensi-rise-app";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-1 flex-col items-center justify-center gap-4 bg-background p-4 sm:p-6">
        <SensiRiseApp />
    </main>
  );
}
