import { useState } from "react";

const MONTHS = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

export default function PeriodizationModal({ invoiceData, onClose }) {
  const today = new Date();
  const [fromMonth, setFromMonth] = useState(today.getMonth() + 1);
  const [fromYear, setFromYear] = useState(today.getFullYear());
  const [toMonth, setToMonth] = useState(today.getMonth() + 1);
  const [toYear, setToYear] = useState(today.getFullYear());
  const [distribution, setDistribution] = useState("equal");

  const handleApply = () => {
    // Placeholder: full implementation requires backend support
    console.log("Periodisering:", { fromMonth, fromYear, toMonth, toYear, distribution });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Periodisera kostnad</h2>

        {invoiceData?.supplier && (
          <p className="text-sm text-gray-500 mb-4">
            {invoiceData.supplier} · {invoiceData.total_amount} {invoiceData.currency || "SEK"}
          </p>
        )}

        <div className="space-y-4">
          {/* From period */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Från period</label>
            <div className="flex gap-2">
              <select
                value={fromMonth}
                onChange={(e) => setFromMonth(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={fromYear}
                onChange={(e) => setFromYear(Number(e.target.value))}
                className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* To period */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Till period</label>
            <div className="flex gap-2">
              <select
                value={toMonth}
                onChange={(e) => setToMonth(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={toYear}
                onChange={(e) => setToYear(Number(e.target.value))}
                className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Distribution method */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fördelning</label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="distribution"
                  value="equal"
                  checked={distribution === "equal"}
                  onChange={() => setDistribution("equal")}
                  className="accent-violet-600"
                />
                Distribuera lika per månad
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="distribution"
                  value="manual"
                  checked={distribution === "manual"}
                  onChange={() => setDistribution("manual")}
                  className="accent-violet-600"
                />
                Manuell fördelning
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Stäng
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-1.5 text-sm bg-violet-600 text-white rounded font-medium hover:bg-violet-700 transition-colors"
          >
            Tillämpa
          </button>
        </div>
      </div>
    </div>
  );
}
