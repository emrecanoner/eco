import { getProfile } from "@/lib/notion/profile";
import { getSettings } from "@/lib/notion/settings";
import { Hero } from "@/components/landing/Hero";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, settings] = await Promise.all([
    getProfile(),
    getSettings(),
  ]);

  if (!profile) {
    return (
      <Container>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center text-center sm:min-h-[calc(100vh-14rem)]">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Profile data not available. Please configure Notion integration.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Hero profile={profile} title={settings?.title} />
    </Container>
  );
}
