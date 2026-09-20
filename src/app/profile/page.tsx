import AppShell from "@/components/AppShell";

const accountSections = [
  {
    title: "Account",
    description: "Your authenticated account information.",
  },
  {
    title: "Plan",
    description: "Subscription and plan information.",
  },
  {
    title: "Credits",
    description: "Available, reserved and used credits.",
  },
  {
    title: "Credit History",
    description: "Real credit transactions and job references.",
  },
  {
    title: "Usage",
    description: "Usage information and recent activity.",
  },
  {
    title: "Stack",
    description: "Seven-day activity and reward progress.",
  },
  {
    title: "Payments",
    description: "Purchases and verified payment transactions.",
  },
  {
    title: "Settings",
    description: "Account and application preferences.",
  },
];

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="text-sm font-medium text-violet-400">
            PROFILE
          </div>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Account & Settings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Account information, plan, credits, usage, Stack, payments and
            settings will be loaded from the authenticated account.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
          <div className="text-sm text-gray-500">
            Signed-in account
          </div>

          <div className="mt-2 text-lg font-semibold">
            Account information unavailable
          </div>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Authentication and database integration will populate this section
            with the real account data.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accountSections.map((section) => (
            <button
              key={section.title}
              className="rounded-2xl border border-[#1d2330] bg-[#0d1118] p-5 text-left transition hover:border-violet-500/40 hover:bg-[#10151e]"
            >
              <h2 className="font-semibold">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {section.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#1d2330] bg-[#0d1118] p-6">
          <div className="font-semibold">7-Day Stack</div>

          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#252b38] bg-[#080b10] p-3 text-center"
              >
                <div className="text-xs text-gray-600">
                  Day
                </div>

                <div className="mt-1 font-semibold">
                  {index + 1}
                </div>

                <div className="mt-2 text-[10px] text-gray-700">
                  —
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-600">
            Activity and reward values will come from the real account system.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
