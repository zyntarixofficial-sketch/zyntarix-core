import Link from "next/link";
import AppShell from "@/components/AppShell";

const areas = [
  {
    title: "Nexa",
    description: "Describe what you want to build.",
    href: "/nexa",
  },
  {
    title: "Projects",
    description: "Manage your software projects.",
    href: "/projects",
  },
  {
    title: "Forge",
    description: "Code, files, preview and agents.",
    href: "/forge",
  },
  {
    title: "Test",
    description: "Verify builds before shipping.",
    href: "/test",
  },
  {
    title: "Ship",
    description: "Prepare deployment and releases.",
    href: "/ship",
  },
  {
    title: "Profile",
    description: "Account, plan, credits and usage.",
    href: "/profile",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mb-10">
        <div className="text-sm font-medium text-violet-400">ZYNTARIX</div>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Your Software Factory
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Build, verify and ship software through one controlled development
          environment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <Link
            key={area.title}
            href={area.href}
            className="group rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6 transition hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-[#10151e]"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{area.title}</h2>

              <span className="text-gray-600 transition group-hover:text-violet-400">
                →
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {area.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
        <div className="text-lg font-semibold">Account data</div>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Credits, projects, usage and Stack information will be loaded from
          the real authenticated account. No fake production data is used.
        </p>
      </div>
    </AppShell>
  );
}
