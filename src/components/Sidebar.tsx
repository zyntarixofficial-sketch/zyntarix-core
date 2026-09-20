"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Nexa", href: "/nexa", icon: "✦" },
  { name: "Projects", href: "/projects", icon: "▣" },
  { name: "Forge", href: "/forge", icon: "⌘" },
  { name: "Test", href: "/test", icon: "✓" },
  { name: "Ship", href: "/ship", icon: "↗" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#1d2330] bg-[#090c12] md:flex md:flex-col">
      <div className="flex h-20 items-center border-b border-[#1d2330] px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-bold">
            Z
          </div>

          <div>
            <div className="font-bold tracking-wide">Zyntarix</div>
            <div className="text-[10px] tracking-wider text-gray-500">
              SOFTWARE FACTORY
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-violet-500/15 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#1d2330] p-4">
        <Link
          href="/profile"
          className="block rounded-xl border border-[#1d2330] bg-[#0d1118] p-4 transition hover:border-violet-500/40"
        >
          <div className="text-xs text-gray-500">Account</div>
          <div className="mt-1 text-sm font-medium">Profile & Settings</div>
          <div className="mt-2 text-xs text-gray-600">
            Real account data will appear here.
          </div>
        </Link>
      </div>
    </aside>
  );
}
