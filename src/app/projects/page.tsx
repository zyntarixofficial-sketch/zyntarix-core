import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium text-violet-400">
              PROJECTS
            </div>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Your Projects
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Create, manage and continue your software projects from one
              workspace.
            </p>
          </div>

          <Link
            href="/nexa"
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            + New Project
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-[#292f3c] bg-[#0b0f15] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
            ▣
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No projects available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Your authenticated projects will appear here automatically.
            Nothing is hard-coded into the production interface.
          </p>

          <Link
            href="/nexa"
            className="mt-6 inline-flex rounded-xl border border-[#292f3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Start a project with Nexa
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ProjectFeature
            title="Project Brain"
            text="Keep architecture, decisions, requirements and important context connected to the project."
          />

          <ProjectFeature
            title="Versions"
            text="Track checkpoints and changes so large modifications can be reviewed and rolled back safely."
          />

          <ProjectFeature
            title="Verification"
            text="Projects will later show test, security, performance and release evidence."
          />
        </div>
      </div>
    </AppShell>
  );
}

function ProjectFeature({
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
