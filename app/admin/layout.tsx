"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    }
  };

  const navs = [
    { name: "Settings", href: "/admin", icon: "fa-gear" },
    { name: "Rooms", href: "/admin/rooms", icon: "fa-door-open" },
    { name: "Guide Steps", href: "/admin/steps", icon: "fa-list-ol" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative z-0">
      {/* Background Orbs to match SiteChrome */}
      <div className="orb w-96 h-96 bg-ocean-100 opacity-40 fixed top-[-80px] right-[-80px] -z-10" />
      <div className="orb w-64 h-64 bg-cyan-light opacity-60 fixed bottom-[40px] left-[-60px] -z-10" />

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/80 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-200/80">
          <h1 className="font-display text-xl text-ocean-800 font-bold flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-ocean-600" />
            Admin Panel
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Laut Otsuka Setup Guide</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navs.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-ocean-600 to-ocean-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-ocean-700"
                }`}
              >
                <i className={`fa-solid ${nav.icon} w-5 text-center`} />
                {nav.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
