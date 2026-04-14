import DashboardTile from "@/components/dashboardTile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabaseServerClient = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabaseServerClient.auth.getUser();

  if (!user || error) {
    redirect("/auth/login");
  }

  const dashboardTiles = [
    { id: 1, label: "Kunder", href: "/kundeoversigt", icon: "📋" },
    { id: 2, label: "Opret tilbud", href: "/tilbud", icon: "📝" },
    { id: 3, label: "Salg", href: "/salg", icon: "📈" },
  ];

  return (
    <div>
      <div className="grid gap-4 grid-cols-1">
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
