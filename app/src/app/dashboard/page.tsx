import DashboardTile from "@/components/dashboardTile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/auth/login");
  }

  const displayName = user.email?.split("@")[0];

  const dashboardTiles = [
    { id: 1, label: "Kunder", href: "/kundeoversigt", icon: "📋" },
    { id: 2, label: "Opret tilbud", href: "/tilbud", icon: "📝" },
    { id: 3, label: "Salg", href: "/salg", icon: "📈" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
