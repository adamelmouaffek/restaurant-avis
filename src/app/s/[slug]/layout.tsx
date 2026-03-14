"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import ServerLayout from "@/modules/server/components/ServerLayout";
import type { EstablishmentType } from "@/shared/types";

interface SessionData {
  staffId: string;
  staffName: string;
  restaurantId: string;
  slug: string;
  role: string;
  establishmentType?: string;
}

export default function ServerSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.slug as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [checked, setChecked] = useState(false);

  // Pages that render their own full-screen layout (no header/tabs wrapper)
  const isLoginPage = pathname === `/s/${slug}`;
  const isOrderPage = pathname?.includes("/order/new/") ?? false;
  const isFullScreenPage = isLoginPage || isOrderPage;

  // Verify auth via API (cookie is httpOnly, can't read from client)
  useEffect(() => {
    if (isLoginPage) {
      // No auth check needed on login page
      setChecked(true);
      return;
    }

    async function checkSession() {
      try {
        const res = await fetch(`/api/server/${slug}/me`);
        if (res.ok) {
          const data: SessionData = await res.json();
          setSession(data);
        } else {
          // Not authenticated - redirect to login
          router.replace(`/s/${slug}`);
        }
      } catch {
        router.replace(`/s/${slug}`);
      } finally {
        setChecked(true);
      }
    }

    checkSession();
  }, [slug, isLoginPage, router]);

  if (!checked) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Full-screen pages (login, order taking): render without layout wrapper
  if (isFullScreenPage) {
    return <>{children}</>;
  }

  // No session and not login page: show loading while redirecting
  if (!session) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated pages: wrap with server layout
  return (
    <ServerLayout
      slug={slug}
      staffName={session.staffName}
      restaurantName={slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      establishmentType={(session.establishmentType as EstablishmentType) || "restaurant"}
    >
      {children}
    </ServerLayout>
  );
}
