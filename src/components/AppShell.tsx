import Sidebar from "./Sidebar";
import Zyn from "./Zyn";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090d]">
      <Sidebar />

      <main className="min-h-screen md:pl-64">
        <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      <Zyn />
    </div>
  );
}
