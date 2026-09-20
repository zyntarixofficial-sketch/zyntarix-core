import AppShell from "@/components/AppShell";

const releaseTargets = [
  {
    title: "Web",
    description: "Prepare a verified web deployment.",
  },
  {
    title: "Custom Domain",
    description: "Connect a project domain or Zyntarix subdomain.",
  },
  {
    title: "Android",
    description: "Prepare APK/AAB build and release configuration.",
  },
  {
    title: "iOS",
    description: "Prepare iOS build and TestFlight workflow.",
  },
  {
    title: "Store Release",
    description: "Prepare store metadata and release requirements.",
  },
  {
    title: "Release Doctor",
    description: "Check release blockers before deployment.",
  },
];

export default function ShipPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="text-sm font-medium text-blue-400">
            ZYNTARIX SHIP
          </div>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Ship Your Software
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Move verified projects toward deployment, domains, mobile builds
            and release preparation.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Release status</div>

              <p className="mt-1 text-sm text-gray-500">
                No project selected.
              </p>
            </div>

            <div className="rounded-lg border border-[#292f3c] px-4 py-2 text-xs text-gray-500">
              Not ready
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {releaseTargets.map((target) => (
            <button
              key={target.title}
              className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-5 text-left transition hover:border-blue-500/40 hover:bg-[#10151e]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-blue-400">
                ↗
              </div>

              <h2 className="mt-5 font-semibold">
                {target.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {target.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
          <div className="font-semibold">Important</div>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Deployment and store publishing will only proceed after the
            project's required verification evidence is available. Actions
            requiring user or platform approval will remain under explicit
            control.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
