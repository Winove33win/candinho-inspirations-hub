import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <SiteHeader />
      <main className="mx-auto min-h-[60vh] max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export default RootLayout;
