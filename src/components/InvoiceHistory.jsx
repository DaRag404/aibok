import { useEffect, useState } from "react";
import { fetchInvoices } from "../api";

const fmtAmount = (n, currency = "SEK") =>
  new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n) + " " + currency;

const fmtDate = (iso) => {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("sv-SE");
};

export default function InvoiceHistory() {
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
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">Bokförda fakturor</h1>
        <span className="text-sm text-gray-400">{invoices.length} fakturor</span>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="bg-white mx-6 my-5 rounded border border-gray-200">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">Laddar…</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-sm text-red-500">{error}</div>
          ) : invoices.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">
              Inga bokförda fakturor ännu
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Bokförd</th>
                  <th className="px-6 py-3 font-medium">Fakturadatum</th>
                  <th className="px-6 py-3 font-medium">Leverantör</th>
                  <th className="px-6 py-3 font-medium">Fakturanr</th>
                  <th className="px-6 py-3 font-medium text-right">Belopp</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-gray-50 hover:bg-violet-50 transition-colors ${
                      i % 2 === 0 ? "" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-3 text-gray-500">{fmtDate(inv.booked_at)}</td>
                    <td className="px-6 py-3 text-gray-700">{inv.invoice_date || "–"}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{inv.supplier}</td>
                    <td className="px-6 py-3 text-gray-500 font-mono">{inv.invoice_number || "–"}</td>
                    <td className="px-6 py-3 text-right font-mono tabular-nums text-gray-800">
                      {fmtAmount(inv.total_amount, inv.currency)}
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
