import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/shared/components/skeleton"

const RegisterPageClient = dynamic(() => import("./RegisterPageClient"))

function Loading() {
  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
      <div className="absolute top-[-100px] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[300px] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00E676]/5 blur-[120px] pointer-events-none" />
      <div className="flex-grow flex flex-col items-center justify-center gap-6 px-4 max-w-4xl mx-auto w-full">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-2/3" />
        <div className="w-full rounded-2xl border border-white/5 bg-[#0A0A0A]/40 p-8 space-y-6 mt-8">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
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
