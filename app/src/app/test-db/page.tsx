import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function TestPage() {
  const supabase = await createClient();

  // 1. HENT DATA: Henter alle kunder sorteret efter nyeste først
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("id", { ascending: false });

  // 2. ACTION: OPRET KUNDE MED VALIDERING
  async function addCustomer(formData: FormData) {
    "use server";
    const supabase = await createClient();

    // Hent værdier fra formen
    const navn = formData.get("navn") as string;
    const nummer = formData.get("nummer") as string;
    const email = formData.get("email") as string;
    const adresse = formData.get("adresse") as string;
    const cvr_nr = formData.get("cvr_nr") as string;

    if (/\d/.test(navn)) {
      console.error("Valideringsfejl: Navn må ikke indeholde tal.");
      return;
    }

    if (parseInt(nummer) < 0) {
      console.error("Valideringsfejl: Nummer må ikke være negativt.");
      return;
    }

    const rawData = {
      navn,
      nummer,
      adresse,
      email,
      cvr_nr,
    };

    const { error } = await supabase.from("customers").insert([rawData]);

    if (error) {
      console.error("Database fejl:", error.message);
    } else {
      revalidatePath("/test-db");
    }
  }

  async function deleteCustomer(id: string) {
    "use server";
    const supabase = await createClient();

    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      console.error("Fejl ved sletning:", error.message);
    } else {
      revalidatePath("/test-db");
    }
  }

  return (
    <div className="p-10 max-w-5xl mx-auto bg-gray-50 min-h-screen text-black font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900">
          Kundeoplysninger
        </h1>
        <p className="text-gray-500 mt-2">
          Administrer dine kunder sikkert i skyen
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FORMULAR SEKTION */}
        <section>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              Opret Ny Kunde
            </h2>

            <form action={addCustomer} className="space-y-5">
              {/* NAVN: Kun bogstaver (æøå inklusiv) */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Fuldt Navn *
                </label>
                <input
                  name="navn"
                  type="text"
                  required
                  pattern="^[a-zA-ZæøåÆØÅ ]+$"
                  title="Brug kun bogstaver (ingen tal)"
                  placeholder="Eks. Mads Madsen"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* TELEFON: Kun positive tal */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Telefon
                  </label>
                  <input
                    name="nummer"
                    type="number"
                    min="0"
                    placeholder="88888888"
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                  />
                </div>
                {/* CVR: Præcis 8 tal */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    CVR Nr.
                  </label>
                  <input
                    name="cvr_nr"
                    type="text"
                    pattern="\d{8}"
                    maxLength={8}
                    title="Et CVR skal være præcis 8 tal"
                    placeholder="12345678"
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Email Adresse
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="kunde@firma.dk"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Adresse
                </label>
                <input
                  name="adresse"
                  type="text"
                  placeholder="Vejnavn 1, 8000 Aarhus"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-[0.98]"
              >
                Gem Kunde i Systemet
              </button>
            </form>
          </div>
        </section>

        {/* LISTE SEKTION */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-gray-800">Aktive Kunder</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
              Total: {customers?.length || 0}
            </span>
          </div>

          <div className="space-y-4">
            {customers?.map((customer) => (
              <div
                key={customer.id}
                className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {customer.navn}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="mr-2">📞</span> {customer.nummer || "-"}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="mr-2">🏢</span> CVR:{" "}
                      {customer.cvr_nr || "-"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 italic">
                    {customer.email}
                  </p>
                </div>

                <form action={deleteCustomer.bind(null, customer.id)}>
                  <button
                    type="submit"
                    className="ml-4 p-3 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Slet kunde"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            ))}

            {customers?.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 italic">
                  Ingen kunder i kartoteket endnu.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
