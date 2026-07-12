export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0F1A] font-sans text-white">
      <main className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md max-w-lg mx-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-3xl">
          ⚡
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          EduSpark Academy
        </h1>
        <p className="text-indigo-200/70 text-lg">
          Tuition Management System Backend API is active.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <a
            href="/api/health"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
          >
            Check Health status
          </a>
        </div>
      </main>
      <footer className="absolute bottom-6 text-sm text-white/40">
        © {new Date().getFullYear()} EduSpark Academy. All rights reserved.
      </footer>
    </div>
  );
}
