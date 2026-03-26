'use client'

import DashboardTile from '@/components/DashboardTile';


const dashboardTiles = [
  { id: 1, label: 'Kunder', href: '/kundeoversigt', icon: '📋' },
  { id: 2, label: 'Opret tilbud', href: '/tilbud', icon: '📝' },
  { id: 3, label: 'Salg', href: '/salg', icon: '📈' },
];


import React from 'react'

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 px-4 py-10 text-zinc-900">
      <main className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Twilio Test
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Send a mock or real SMS from Next.js
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">
            Start in mock mode to test the full request flow safely. When your
            Twilio environment variables are added, you can turn mock mode off
            and send a real SMS instead.
          </p>
        </div>



        <section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Expected setup
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Real sends require <code>TWILIO_ACCOUNT_SID</code>,{" "}
            <code>TWILIO_AUTH_TOKEN</code>, and{" "}
            <code>TWILIO_PHONE_NUMBER</code> in your environment.
          </p>
        </section>


      </main>
    </div>
  );
}


// export default function Home() {
//   return (
//     <main className="w-full">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         {dashboardTiles.map((tile) => (
//           <DashboardTile
//             key={tile.id}
//             label={tile.label}
//             href={tile.href}
//             icon={tile.icon}
//           />
//         ))}
//       </div>
//     </main>
//   );
// }
