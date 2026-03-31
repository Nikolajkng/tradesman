"use client";

import { useState, useEffect } from "react";
import { supabase_client } from "@/lib/supabase/client";

type Customer = {
  id: string; // Supabase bruger UUID (strenge)
  navn: string;
  nummer: string;
};

export default function Kundeoversigt() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    navn: "",
    nummer: "",
  });

  // Get customers from supabase
  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase_client
        .from("kunder")
        .select("id, navn, nummer");

      if (data) setCustomers(data);
      if (error) console.error("Error fetching customers:", error.message);
    }
    fetchCustomers();
  }, []);

  // handle input change for form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Save Data to supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase_client
      .from("kunder")
      .insert([{ navn: formData.navn, nummer: formData.nummer }])
      .select();

    if (data) {
      setCustomers((current) => [...current, data[0]]);
      setFormData({ navn: "", nummer: "" });
      setShowForm(false);
    }

    if (error) alert("Error saving customer: " + error.message);
    setLoading(false);
  };

  // Delete customer from supabase
  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på, at du vil slette denne kunde?")) return;

    const { error } = await supabase_client
      .from("kunder")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting customer: " + error.message);
    } else {
      setCustomers((current) =>
        current.filter((customer) => customer.id !== id),
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{padding: "10px 20px", marginBottom: "20px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}
      >
        {showForm ? "Annuller" : "Opret Kunde"}
      </button>

      {showForm && (
        <div style={{marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "4px"}}>
          <h2>Ny kunde</h2>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
            <input
              type="text"
              name="navn"
              placeholder="Navn"
              value={formData.navn}
              onChange={handleInputChange}
              style={{padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
            />
            <input
              type="text"
              name="nummer"
              placeholder="Nummer"
              value={formData.nummer}
              onChange={handleInputChange}
              style={{padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
            />
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{padding: "8px 16px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}
            >
              {loading ? "Gemmer..." : "Gem"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{padding: "8px 16px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}
            >
              Annuller
            </button>
          </div>
        </div>
      )}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left",}}>Navn</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left",}}>Nummer </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign:"left", }}>Handling</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{customer.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{customer.navn}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{customer.nummer}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  onClick={() => handleDelete(customer.id)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Slet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && !loading && (
        <p style={{ marginTop: "20px", color: "#666" }}>Ingen kunder fundet.</p>
      )}
    </div>
  );
}
