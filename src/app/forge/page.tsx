import AppShell from "@/components/AppShell";

const panels = [
  {
    title: "Code",
    description: "Project source code and controlled changes.",
    icon: "</>",
  },
  {
    title: "Files",
    description: "Project files, assets and configuration.",
    icon: "▤",
  },
  {
    title: "Preview",
    description: "Interactive application preview.",
    icon: "◉",
  },
  {
    title: "Agents",
    description: "Specialized agents working on project tasks.",
    icon: "✦",
  },
  {
    title: "Logs",
    description: "Build, runtime and task execution logs.",
    icon: "≡",
  },
  {
    title: "Versions",
    description: "Checkpoints, changes and rollback history.",
    icon: "↶",
  },
];

export default function ForgePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-sm font-medium text-violet-400">
            ZYNTARIX FORGE
          </div>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Development Workspace
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Code, files, previews, agents, logs and project versions will
            eventually work together inside this controlled environment.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map((panel) => (
            <button
              key={panel.title}
              className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6 text-left transition hover:border-violet-500/40 hover:bg-[#10151e]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-violet-400">
                {panel.icon}
              </div>

              <h2 className="mt-5 font-semibold">
                {panel.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {panel.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Controlled execution</div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Future build tasks will run through isolated workers rather
                than blocking the main application.
              </p>
            </div>

            <div className="rounded-lg border border-[#292f3c] px-4 py-2 text-xs text-gray-500">
              Workspace ready
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
