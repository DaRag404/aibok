const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function Summary({
  lines = [],
  invoiceTotal = 0,
  invoiceVat = 0,
  currency = "SEK",
  onBook,
  onCancel,
  onPeriodize,
  bookingStatus,
  isEditing = false,
}) {
  const netTotal = lines.reduce((s, l) => s + (parseFloat(l.net_amount) || 0), 0);
  const vatTotal = parseFloat(invoiceVat) || 0;
  // Round same way as backend: round(net + vat, 2)
  const calcTotal = Math.round((netTotal + vatTotal) * 100) / 100;
  const total = parseFloat(invoiceTotal) || 0;
  const diff = Math.round((total - calcTotal) * 100) / 100;
  const isBalanced = Math.abs(diff) < 0.005 && lines.length > 0;

  const isSaving = bookingStatus === "saving";
  const isSaved = bookingStatus === "saved";

  const row = (label, value) => (
    <div className="flex justify-between py-0.5 text-sm">
      <span className="text-gray-600">{label}:</span>
      <span className="font-mono tabular-nums">{fmt(value)}</span>
    </div>
  );

  const bookLabel = isEditing ? "Spara ändringar" : "Bokför";
  const savedLabel = isEditing ? "Sparad" : "Bokförd";

  return (
    <div className="flex flex-col gap-4">
      {/* Summering */}
      <div>
        {row("Totalbelopp", total)}
        {row("Belopp exkl. moms", netTotal)}
        {row("Moms", vatTotal)}
        <div className="border-t border-gray-200 mt-1.5 pt-1.5" />
        <div className={`flex justify-between py-0.5 text-sm font-semibold ${
          isBalanced || lines.length === 0 ? "text-gray-800" : "text-red-600"
        }`}>
          <span>Differens:</span>
          <span className="font-mono tabular-nums">{fmt(diff)}</span>
        </div>
      </div>

      {/* Knappar */}
      <div className="flex items-center gap-2 justify-end pt-1 border-t border-gray-200">
        <button
          onClick={onPeriodize}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Periodisera
        </button>

        <button
          disabled={!isBalanced || isSaving || isSaved}
          onClick={onBook}
          className={`px-5 py-1.5 text-sm rounded font-medium transition-colors min-w-[120px] ${
            isSaved
              ? "bg-green-600 text-white cursor-default"
              : isBalanced && !isSaving
              ? "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-1.5">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sparar…
            </span>
          ) : isSaved ? (
            <span className="flex items-center justify-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {savedLabel}
            </span>
          ) : (
            bookLabel
          )}
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
