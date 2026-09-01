import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Admin — Mental Health Screening',
  // This panel is unauthenticated and shows participant data. At minimum keep
  // it out of search indexes.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The root layout wraps every page in a centred, 480px-wide "phone frame"
 * (`app-ambient md:flex md:items-center md:justify-center`). The admin panel
 * needs full width, so this layout breaks out with `fixed inset-0` rather than
 * modifying the survey's root layout.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-sunken" dir="ltr">
      <header className="sticky top-0 z-20 border-b border-line bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-bright text-[13px] font-bold text-white shadow-glow">
              M
            </span>
            <span className="text-[15px] font-bold tracking-tight text-ink">
              Screening Admin
            </span>
          </Link>

          <AdminNav />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-7">{children}</main>
    </div>
  );
}
