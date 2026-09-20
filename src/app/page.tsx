import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-2xl font-bold shadow-2xl shadow-violet-500/20">
            Z
          </div>

          <div className="mb-5 text-xs font-semibold tracking-[0.3em] text-violet-400">
            AI SOFTWARE FACTORY
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Idea
            <span className="mx-2 text-violet-500">→</span>
            Build
            <span className="mx-2 text-blue-500">→</span>
            Verify
            <span className="mx-2 text-violet-500">→</span>
            Ship
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Zyntarix is an AI software factory designed to turn ideas into
            functional software through planning, specialized agents,
            verification and controlled deployment.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Enter Zyntarix
            </Link>

            <Link
              href="/nexa"
              className="rounded-xl border border-[#292f3c] px-7 py-3 font-semibold text-white transition hover:bg-white/5"
            >
              Meet Nexa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
