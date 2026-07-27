import { GraduationCap, LineChart, ShieldCheck, Sparkles } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure',
    description: 'Role-based access control',
  },
  {
    icon: LineChart,
    title: 'Track',
    description: 'Monitor tasks and progress',
  },
  {
    icon: Sparkles,
    title: 'Improve',
    description: 'Boost team productivity',
  },
]

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="auth-panel-glow auth-dot-pattern relative hidden min-h-screen overflow-hidden px-12 py-14 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="relative mx-auto w-full max-w-lg">
          <div className="text-center">
            <div className="mb-10 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0f2744]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Internship Portal</p>
                  <p className="text-xs text-slate-300">Management & Tracking</p>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Internship Management & Task Tracking System
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-300">
              Manage interns, projects, tasks, daily work logs and track progress in one place.
            </p>
          </div>

          <div className="grid gap-4 text-left" style={{ marginTop: '5rem' }}>
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/25 text-blue-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-slate-300">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center bg-[#dde3ea] px-6 py-12">
        <div className="w-full" style={{ maxWidth: '420px' }}>
          {children}
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          © 2026 Internship Management System. All rights reserved.
        </p>
      </section>
    </div>
  )
}
