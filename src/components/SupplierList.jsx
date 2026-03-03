import { useEffect, useState } from "react";
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../api";
import SupplierModal from "./SupplierModal";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | "new" | supplier-object (edit)
  const [deleteConfirm, setDeleteConfirm] = useState(null); // supplier id

  const load = () => {
    setIsLoading(true);
    fetchSuppliers()
      .then(setSuppliers)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const handleSave = async (form) => {
    if (modal?.id) {
      const updated = await updateSupplier(modal.id, form);
      setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await createSupplier(form);
      setSuppliers((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, "sv")));
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    await deleteSupplier(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">Leverantörer</h1>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 text-white text-sm font-medium rounded hover:bg-violet-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lägg till leverantör
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white mx-6 my-5 rounded border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-400">Laddar…</div>
          ) : error ? (
            <div className="px-6 py-16 text-center text-sm text-red-500">{error}</div>
          ) : suppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-400">Inga leverantörer tillagda ännu</p>
              <button
                onClick={() => setModal("new")}
                className="mt-1 px-4 py-1.5 bg-violet-600 text-white text-sm font-medium rounded hover:bg-violet-700 transition-colors"
              >
                Lägg till din första leverantör
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Namn</th>
                  <th className="px-6 py-3 font-medium">Orgnr</th>
                  <th className="px-6 py-3 font-medium">Ort</th>
                  <th className="px-6 py-3 font-medium">E-post</th>
                  <th className="px-6 py-3 font-medium">Bankgiro</th>
                  <th className="px-6 py-3 font-medium text-center">Villkor</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-violet-50/40 transition-colors group">
                    <td className="px-6 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{s.org_number || "–"}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {[s.city, s.country].filter(Boolean).join(", ") || "–"}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {s.email
                        ? <a href={`mailto:${s.email}`} className="hover:text-violet-600 transition-colors">{s.email}</a>
                        : "–"}
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{s.bankgiro || s.plusgiro || "–"}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{s.payment_terms} d</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button
                          onClick={() => setModal(s)}
                          className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          title="Redigera"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(s.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Ta bort"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add/Edit modal */}
      {modal !== null && (
        <SupplierModal
          supplier={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="font-semibold text-gray-800 mb-2">Ta bort leverantör?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Åtgärden kan inte ångras. Befintliga fakturor påverkas inte.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors">
                Avbryt
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors">
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
