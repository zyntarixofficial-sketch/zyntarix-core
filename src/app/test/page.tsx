import AppShell from "@/components/AppShell";

const checks = [
  {
    title: "Build Verification",
    description: "Check whether the project builds successfully.",
  },
  {
    title: "Functional Tests",
    description: "Verify important user flows and application behavior.",
  },
  {
    title: "Security",
    description: "Check common security risks and unsafe configurations.",
  },
  {
    title: "Performance",
    description: "Measure important performance characteristics.",
  },
  {
    title: "Visual Tests",
    description: "Verify important UI states and responsive layouts.",
  },
  {
    title: "Release Readiness",
    description: "Collect evidence required before a release can proceed.",
  },
];

export default function TestPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="text-sm font-medium text-violet-400">
            VERIFICATION
          </div>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Test & Verify
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Zyntarix should use evidence from builds, tests, security checks
            and other verification systems before software is considered ready.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Verification status</div>

              <p className="mt-1 text-sm text-gray-500">
                No project selected.
              </p>
            </div>

            <div className="rounded-lg border border-[#292f3c] px-4 py-2 text-xs text-gray-500">
              Waiting for project
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map((check) => (
            <div
              key={check.title}
              className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-500">
                  ✓
                </div>

                <h2 className="font-semibold">{check.title}</h2>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                {check.description}
              </p>

              <div className="mt-4 text-xs text-gray-600">
                Not run
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="font-semibold">Judge Brain</div>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            The final verification layer will evaluate evidence from multiple
            checks. Agents will not be allowed to declare their own work
            successful.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
