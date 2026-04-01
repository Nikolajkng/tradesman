"use client";

import { useState, useEffect } from "react";
import { supabase_client } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const Icons = {
  User: "👤",
  Tool: "🛠️",
  Clock: "⏱️",
  Truck: "🚚",
  File: "📄",
  Trash: "🗑️",
  Edit: "✏️",
  Check: "✅",
};

export default function OpretTilbud() {
  const router = useRouter();
  const [kunder, setKunder] = useState<any[]>([]);
  const [senesteTilbud, setSenesteTilbud] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [redigeringsId, setRedigeringsId] = useState<string | null>(null);

  // FORM STATES
  const [valgtKunde, setValgtKunde] = useState("");
  const [belobService, setBelobService] = useState<string | number>("");
  const [tidsforbrug, setTidsforbrug] = useState<string | number>("");
  const [timepris, setTimepris] = useState<string | number>("500");
  const [materialer, setMaterialer] = useState("");
  const [korsel, setKorsel] = useState<string | number>("");
  const [dokumentationPris, setDokumentationPris] = useState<string | number>(
    "",
  );
  const [noter, setNoter] = useState("");

  const iAlt =
    Number(belobService || 0) +
    Number(tidsforbrug || 0) * Number(timepris || 0) +
    Number(korsel || 0) +
    Number(dokumentationPris || 0);

  useEffect(() => {
    fetchKunder();
    fetchSenesteTilbud();
  }, []);

  const fetchKunder = async () => {
    const { data } = await supabase_client.from("kunder").select("id, navn");
    if (data && data.length > 0) {
      setKunder(data);
      setValgtKunde(data[0].id);
    }
  };

  const fetchSenesteTilbud = async () => {
    const { data } = await supabase_client
      .from("tilbud")
      .select("*, kunder(navn)")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setSenesteTilbud(data);
  };

  // --- NY SLET FUNKTION ---
  const handleSlet = async (id: string) => {
    if (!confirm("Er du sikker på, at du vil slette denne rapport permanent?"))
      return;

    try {
      const { error } = await supabase_client
        .from("tilbud")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Opdater listen med det samme efter sletning
      setSenesteTilbud((prev) => prev.filter((item) => item.id !== id));

      // Hvis man var i gang med at redigere det tilbud man lige slettede, så nulstil
      if (redigeringsId === id) {
        handleKundeSkift(valgtKunde);
      }
    } catch (error: any) {
      alert("Fejl ved sletning: " + error.message);
    }
  };

  const handleKundeSkift = (id: string) => {
    setValgtKunde(id);
    setRedigeringsId(null);
    setBelobService("");
    setTidsforbrug("");
    setMaterialer("");
    setKorsel("");
    setDokumentationPris("");
    setNoter("");
    setTimepris("500");
  };

  const handleRediger = (t: any) => {
    setRedigeringsId(t.id);
    setValgtKunde(t.kunde_id);
    setBelobService(t.service_belob);
    setTidsforbrug(t.timer);
    setTimepris(t.timepris);
    setMaterialer(t.materialer);
    setKorsel(t.korsel_belob);
    setDokumentationPris(t.dokumentation_belob);
    setNoter(t.noter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase_client.auth.getUser();
      const tilbudData = {
        kunde_id: valgtKunde,
        pris: iAlt,
        service_belob: Number(belobService || 0),
        timer: Number(tidsforbrug || 0),
        timepris: Number(timepris || 0),
        materialer,
        korsel_belob: Number(korsel || 0),
        dokumentation_belob: Number(dokumentationPris || 0),
        noter,
        user_id: user?.id,
      };

      const { error } = redigeringsId
        ? await supabase_client
            .from("tilbud")
            .update(tilbudData)
            .eq("id", redigeringsId)
        : await supabase_client.from("tilbud").insert([tilbudData]);

      if (error) throw error;

      setRedigeringsId(null);
      handleKundeSkift(valgtKunde);
      fetchSenesteTilbud();
      alert(redigeringsId ? "Rapport opdateret!" : "Rapport oprettet!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 pb-40">
      {/* HEADER */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 px-4 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-zinc-900 tracking-tight">
              RAPPORT PANEL
            </h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Elektriker POV
            </p>
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            Database Live
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-8 mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* KUNDE */}
          <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-zinc-100 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{Icons.User}</span>
              <h2 className="font-bold text-zinc-800">Kunde</h2>
            </div>
            <select
              value={valgtKunde}
              onChange={(e) => handleKundeSkift(e.target.value)}
              className="w-full p-4 bg-zinc-50 border-none rounded-2xl text-zinc-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {kunder.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.navn}
                </option>
              ))}
            </select>
          </section>

          {/* TID & SERVICE */}
          <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-zinc-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{Icons.Clock}</span>
              <h2 className="font-bold text-zinc-800">Tid & Service</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Service (kr)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={belobService}
                  onChange={(e) => setBelobService(e.target.value)}
                  className="w-full p-4 bg-zinc-50 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Timer
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={tidsforbrug}
                  onChange={(e) => setTidsforbrug(e.target.value)}
                  className="w-full p-4 bg-zinc-50 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-50 transition-all"
                />
              </div>
            </div>
          </section>

          {/* MATERIALER & TRANSPORT */}
          <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-zinc-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{Icons.Tool}</span>
              <h2 className="font-bold text-zinc-800">Materialer</h2>
            </div>
            <textarea
              placeholder="F.eks. Ladeboks type 2..."
              value={materialer}
              onChange={(e) => setMaterialer(e.target.value)}
              className="w-full p-4 bg-zinc-50 rounded-2xl min-h-[100px] font-medium outline-none focus:bg-white border-2 border-transparent focus:border-blue-50 transition-all resize-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Kørsel (kr)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={korsel}
                  onChange={(e) => setKorsel(e.target.value)}
                  className="w-full p-4 bg-zinc-50 rounded-2xl font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Dokum. (kr)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={dokumentationPris}
                  onChange={(e) => setDokumentationPris(e.target.value)}
                  className="w-full p-4 bg-zinc-50 rounded-2xl font-bold outline-none"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 text-white font-black py-6 rounded-[2rem] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading
              ? "BEHANDLER..."
              : redigeringsId
                ? "OPDATER RAPPORT"
                : "OPRET RAPPORT"}{" "}
            {Icons.Check}
          </button>
        </form>

        {/* HISTORIK LISTE MED SLET/REDIGER */}
        <section className="pt-4 space-y-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-4">
            Seneste rapporter
          </h3>
          <div className="space-y-3">
            {senesteTilbud.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-[2rem] border border-zinc-100 flex justify-between items-center group shadow-sm hover:border-blue-100 transition-all"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-xl">
                    {Icons.User}
                  </div>
                  <div>
                    <p className="font-black text-zinc-800 leading-none mb-1">
                      {t.kunder?.navn || "Ukendt kunde"}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-bold">
                      {new Date(t.created_at).toLocaleDateString("da-DK")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-black text-blue-600 text-lg">
                    {Number(t.pris).toLocaleString("da-DK")} kr
                  </span>

                  {/* HER ER DINE RETTEDE KNAPPER */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRediger(t)}
                      className="p-2 bg-zinc-50 hover:bg-blue-50 text-zinc-600 hover:text-blue-600 rounded-xl transition-all"
                      title="Rediger"
                    >
                      {Icons.Edit}
                    </button>
                    <button
                      onClick={() => handleSlet(t.id)}
                      className="p-2 bg-zinc-50 hover:bg-red-50 text-zinc-600 hover:text-red-600 rounded-xl transition-all"
                      title="Slet"
                    >
                      {Icons.Trash}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* STICKY TOTAL BAR */}
      <div className="fixed bottom-8 left-4 right-4 max-w-2xl mx-auto z-20">
        <div className="bg-blue-600 rounded-[2.5rem] p-6 shadow-2xl shadow-blue-200 border-t border-blue-400 flex justify-between items-center">
          <div className="text-white">
            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
              Samlet Tilbud
            </p>
            <p className="text-2xl font-black">I ALT:</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter">
            {iAlt.toLocaleString("da-DK")} kr
          </p>
        </div>
      </div>
    </main>
  );
}
