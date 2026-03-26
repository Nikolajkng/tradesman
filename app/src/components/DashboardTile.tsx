import Link from 'next/link';

interface DashboardTileProps {
  label: string;
  href: string;
  icon: string;
}

export default function DashboardTile({ label, href, icon }: DashboardTileProps) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-zinc-300 cursor-pointer hover:scale-105">
        <div className="text-5xl">{icon}</div>
        <span className="text-sm font-medium text-zinc-700 text-center">{label}</span>
      </div>
    </Link>
  );
}
