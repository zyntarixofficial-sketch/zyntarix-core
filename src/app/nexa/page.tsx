import AppShell from "@/components/AppShell";

const modes = [
  {
    name: "Build",
    description: "Turn an idea into a structured software plan.",
  },
  {
    name: "Explain",
    description: "Understand code, architecture or project decisions.",
  },
  {
    name: "Fix",
    description: "Investigate a problem and create a repair plan.",
  },
  {
    name: "Improve",
    description: "Find ways to improve an existing project.",
  },
  {
    name: "Prompt",
    description: "Create high-quality prompts for your task.",
  },
  {
    name: "Plan",
    description: "Break a large product into safe development steps.",
  },
  {
    name: "Ship",
    description: "Prepare a verified project for deployment.",
  },
];

export default function NexaPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="text-sm font-medium text-violet-400">
            NEXA
          </div>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            What do you want to build?
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Describe your idea naturally. Nexa will turn it into requirements,
            architecture, tasks and a controlled execution plan.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-4 sm:p-6">
          <textarea
            placeholder="Example: I want to build an AI fitness app where users can create workout plans, track progress and receive personalized recommendations..."
            className="min-h-48 w-full resize-none rounded-xl border border-[#252b38] bg-[#080b10] p-4 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-gray-600">
              Describe the product, users, features and goals.
            </div>

            <button className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
              Start with Nexa →
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 text-sm font-semibold text-gray-300">
            Nexa Modes
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((mode) => (
              <button
                key={mode.name}
                className="rounded-xl border border-[#1d2330] bg-[#0d1118] p-4 text-left transition hover:border-violet-500/40 hover:bg-[#10151e]"
              >
                <div className="font-semibold">{mode.name}</div>

                <div className="mt-2 text-xs leading-5 text-gray-500">
                  {mode.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard
            title="Understand"
            text="Nexa converts natural language into a structured product specification."
          />

          <InfoCard
            title="Plan"
            text="The system can break the product into architecture, agents, tasks and dependencies."
          />

          <InfoCard
            title="Verify"
            text="Generated work will later pass through testing and independent verification."
          />
        </div>
      </div>
    </AppShell>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-5">
      <div className="font-semibold">{title}</div>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
}
