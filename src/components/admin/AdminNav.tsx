'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, LayoutDashboard, ShieldAlert, Table2 } from 'lucide-react';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/responses', label: 'Responses', icon: Table2, exact: false },
  { href: '/admin/safety', label: 'Safety', icon: ShieldAlert, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 items-center gap-1">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`tap flex items-center gap-1.5 rounded-chip px-3 py-1.5 text-[13px] font-semibold transition-colors ${
              active
                ? 'bg-primary-light text-primary-dark'
                : 'text-ink-soft hover:bg-surface-sunken hover:text-ink'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}

      {/* Plain anchor, not <Link> — this is a file download, not a route. */}
      <a
        href="/api/admin/export"
        className="tap ms-auto flex items-center gap-1.5 rounded-chip bg-gradient-to-br from-primary to-primary-bright px-3.5 py-2 text-[13px] font-bold text-white shadow-glow"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </a>
    </nav>
  );
}
