import { Suspense } from "react"
import RegisterPageClient from "./RegisterPageClient"

function Loading() {
  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
      <div className="absolute top-[-100px] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[300px] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00E676]/5 blur-[120px] pointer-events-none"></div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-white/40 animate-pulse text-xs font-bold uppercase tracking-widest">Loading registration form...</div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterPageClient />
    </Suspense>
  )
}
