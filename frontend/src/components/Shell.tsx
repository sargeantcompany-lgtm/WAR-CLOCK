import { Link, NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";

export function Shell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(240,195,106,0.09),transparent_28%),linear-gradient(180deg,#090b0f_0%,#0b1017_45%,#090b0f_100%)] bg-news-grid bg-grid text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8">
        <header className="border-b border-white/10 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link to="/" className="text-xs uppercase tracking-[0.35em] text-fog/80">
                WAR CLOCK
              </Link>
              <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
                Documented human cost, presented with restraint.
              </h1>
            </div>
            <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-fog/75">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? "bg-signal text-ink" : "border border-white/10 bg-white/[0.03] hover:border-signal/40 hover:text-white"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? "bg-signal text-ink" : "border border-white/10 bg-white/[0.03] hover:border-signal/40 hover:text-white"}`
                }
              >
                Admin
              </NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}
