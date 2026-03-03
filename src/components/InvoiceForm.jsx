export default function InvoiceForm({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  const cls =
    "w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white " +
    "focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 " +
    "disabled:bg-gray-50 disabled:text-gray-400";

  // Form is editable whenever data object exists (null = no form at all)
  const disabled = data === null;
  const v = (f) => (disabled ? "" : (data[f] ?? ""));

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
      {/* Row 1: Leverantör + checkboxes */}
      <div className="col-span-2">
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Leverantör
        </label>
        <input
          type="text"
          value={v("supplier")}
          disabled={disabled}
          onChange={(e) => set("supplier", e.target.value)}
          className={cls}
          placeholder="Leverantörens namn"
        />
      </div>
      <div className="flex items-end gap-5 pb-1">
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={data?.is_credit ?? false}
            disabled={disabled}
            onChange={(e) => set("is_credit", e.target.checked)}
            className="rounded border-gray-400 accent-violet-600"
          />
          Kreditfaktura
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={data?.skip_payment ?? false}
            disabled={disabled}
            onChange={(e) => set("skip_payment", e.target.checked)}
            className="rounded border-gray-400 accent-violet-600"
          />
          Skicka ej till bank
        </label>
      </div>

      {/* Row 2: Dates + invoice number */}
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Fakturadatum
        </label>
        <input
          type="date"
          value={v("invoice_date")}
          disabled={disabled}
          onChange={(e) => set("invoice_date", e.target.value)}
          className={cls}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Förfallodatum
        </label>
        <input
          type="date"
          value={v("due_date")}
          disabled={disabled}
          onChange={(e) => set("due_date", e.target.value)}
          className={cls}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Lev.fakturanr
        </label>
        <input
          type="text"
          value={v("invoice_number")}
          disabled={disabled}
          onChange={(e) => set("invoice_number", e.target.value)}
          className={cls}
          placeholder="FV-2025-001"
        />
      </div>

      {/* Row 3: Amounts + message */}
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Totalbelopp
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={v("total_amount")}
          disabled={disabled}
          onChange={(e) => set("total_amount", e.target.value === "" ? "" : parseFloat(e.target.value))}
          className={cls + " text-right"}
          placeholder="0,00"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">Varav moms</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={v("vat_amount")}
          disabled={disabled}
          onChange={(e) => set("vat_amount", e.target.value === "" ? "" : parseFloat(e.target.value))}
          className={cls + " text-right"}
          placeholder="0,00"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">Meddelande</label>
        <input
          type="text"
          value={v("message")}
          disabled={disabled}
          onChange={(e) => set("message", e.target.value)}
          className={cls}
          placeholder="Valfritt meddelande"
        />
      </div>
    </div>
  );
}
