import { redirect } from "next/navigation";
import DashboardTile from "@/components/DashboardTile";
import { createClient } from "@/lib/supabase/server";

const dashboardTiles = [
  { id: 1, label: "Kunder", href: "/kundeoversigt", icon: "📋" },
  { id: 2, label: "Opret tilbud", href: "/tilbud", icon: "📝" },
  { id: 3, label: "Salg", href: "/salg", icon: "📈" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div>
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
    </div>
  );
}
