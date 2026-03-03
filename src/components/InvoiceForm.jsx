export default function InvoiceForm({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });
  const cls =
    "w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white " +
    "focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 " +
    "disabled:bg-gray-50 disabled:text-gray-400";
  const empty = !data;
  const v = (f) => (empty ? "" : (data[f] ?? ""));

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
      {/* Row 1: Leverantör + checkboxes */}
      <div className="col-span-2">
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Leverantör
        </label>
        <input type="text" value={v("supplier")} disabled={empty}
          onChange={(e) => set("supplier", e.target.value)} className={cls} />
      </div>
      <div className="flex items-end gap-5 pb-1">
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none whitespace-nowrap">
          <input type="checkbox" checked={data?.is_credit ?? false} disabled={empty}
            onChange={(e) => set("is_credit", e.target.checked)} className="rounded border-gray-400" />
          Kreditfaktura
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none whitespace-nowrap">
          <input type="checkbox" checked={data?.skip_payment ?? false} disabled={empty}
            onChange={(e) => set("skip_payment", e.target.checked)} className="rounded border-gray-400" />
          Skicka ej till bank
        </label>
      </div>

      {/* Row 2: Dates + invoice number */}
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Fakturadatum
        </label>
        <input type="date" value={v("invoice_date")} disabled={empty}
          onChange={(e) => set("invoice_date", e.target.value)} className={cls} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Förfallodatum
        </label>
        <input type="date" value={v("due_date")} disabled={empty}
          onChange={(e) => set("due_date", e.target.value)} className={cls} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Lev.fakturanr
        </label>
        <input type="text" value={v("invoice_number")} disabled={empty}
          onChange={(e) => set("invoice_number", e.target.value)} className={cls} />
      </div>

      {/* Row 3: Amounts + message */}
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          <span className="text-red-500 mr-0.5">*</span>Totalbelopp
        </label>
        <input type="number" step="0.01" value={v("total_amount")} disabled={empty}
          onChange={(e) => set("total_amount", parseFloat(e.target.value) || 0)}
          className={cls + " text-right"} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">Varav moms</label>
        <input type="number" step="0.01" value={v("vat_amount")} disabled={empty}
          onChange={(e) => set("vat_amount", parseFloat(e.target.value) || 0)}
          className={cls + " text-right"} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">Meddelande</label>
        <input type="text" value={v("message")} disabled={empty}
          onChange={(e) => set("message", e.target.value)} className={cls} />
      </div>
    </div>
  );
}
