'use client'

import DashboardTile from '@/components/DashboardTile';


const dashboardTiles = [
  { id: 1, label: 'Kunder', href: '/kundeoversigt', icon: '📋' },
  { id: 2, label: 'Opret tilbud', href: '/tilbud', icon: '📝' },
  { id: 3, label: 'Salg', href: '/salg', icon: '📈' },
];



export default function Home() {
  return (
    <main className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dashboardTiles.map((tile) => (
          <DashboardTile
            key={tile.id}
            label={tile.label}
            href={tile.href}
            icon={tile.icon}
          />
        ))}
      </div>
    </main>
  );
}
