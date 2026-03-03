import { useEffect, useState } from "react";
import { fetchInvoices, invoicePdfUrl } from "../api";

const fmt = (n, currency = "SEK") =>
  new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) +
  "\u00a0" + currency;

const fmtDate = (iso) => {
  if (!iso) return "–";
  const d = iso.includes("T") ? new Date(iso) : new Date(iso + "T00:00:00");
  return d.toLocaleDateString("sv-SE");
};

export default function InvoiceList({ onNew }) {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">Leverantörsfakturor</h1>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 text-white text-sm font-medium rounded hover:bg-violet-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ny leverantörsfaktura
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white mx-6 my-5 rounded border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-400">Laddar…</div>
          ) : error ? (
            <div className="px-6 py-16 text-center text-sm text-red-500">{error}</div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-400">Inga bokförda fakturor ännu</p>
              <button
                onClick={onNew}
                className="mt-1 px-4 py-1.5 bg-violet-600 text-white text-sm font-medium rounded hover:bg-violet-700 transition-colors"
              >
                Lägg till din första faktura
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Bokförd</th>
                  <th className="px-6 py-3 font-medium">Leverantör</th>
                  <th className="px-6 py-3 font-medium">Fakturanr</th>
                  <th className="px-6 py-3 font-medium">Fakturadatum</th>
                  <th className="px-6 py-3 font-medium">Förfallodatum</th>
                  <th className="px-6 py-3 font-medium text-right">Belopp</th>
                  <th className="px-6 py-3 font-medium text-right">Moms</th>
                  <th className="px-4 py-3 font-medium text-center">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-violet-50/40 transition-colors group">
                    <td className="px-6 py-3 text-gray-400 text-xs">{fmtDate(inv.booked_at)}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{inv.supplier}</td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{inv.invoice_number || "–"}</td>
                    <td className="px-6 py-3 text-gray-600">{fmtDate(inv.invoice_date)}</td>
                    <td className="px-6 py-3 text-gray-600">{fmtDate(inv.due_date)}</td>
                    <td className="px-6 py-3 text-right font-mono tabular-nums text-gray-800">
                      {fmt(inv.total_amount, inv.currency)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono tabular-nums text-gray-500">
                      {fmt(inv.vat_amount, "")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.pdf_filename ? (
                        <a
                          href={invoicePdfUrl(inv.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-violet-500 hover:text-violet-700 transition-colors"
                          title="Öppna PDF"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300">–</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
