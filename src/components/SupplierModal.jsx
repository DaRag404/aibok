import { useState } from "react";

const EMPTY = {
  name: "",
  org_number: "",
  vat_number: "",
  address: "",
  zip_code: "",
  city: "",
  country: "Sverige",
  email: "",
  phone: "",
  bankgiro: "",
  plusgiro: "",
  payment_terms: 30,
  notes: "",
};

const cls =
  "w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white " +
  "focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 " +
  "disabled:bg-gray-50 disabled:text-gray-400";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-0.5">
        {required && <span className="text-red-500 mr-0.5">*</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SupplierModal({ supplier, onSave, onClose }) {
  const [form, setForm] = useState(supplier ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Namn är obligatoriskt."); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const isEdit = !!supplier?.id;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 pt-16 pb-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-[640px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? "Redigera leverantör" : "Lägg till leverantör"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Grunduppgifter */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Grunduppgifter</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <Field label="Företagsnamn" required>
                  <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                    className={cls} placeholder="AB Exempelföretag" autoFocus />
                </Field>
              </div>
              <Field label="Organisationsnummer">
                <input type="text" value={form.org_number} onChange={(e) => set("org_number", e.target.value)}
                  className={cls} placeholder="556000-0000" />
              </Field>
              <Field label="Momsregistreringsnummer">
                <input type="text" value={form.vat_number} onChange={(e) => set("vat_number", e.target.value)}
                  className={cls} placeholder="SE556000000001" />
              </Field>
            </div>
          </div>

          {/* Adress */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Adress</h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              <div className="col-span-3">
                <Field label="Gatuadress">
                  <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)}
                    className={cls} placeholder="Storgatan 1" />
                </Field>
              </div>
              <Field label="Postnummer">
                <input type="text" value={form.zip_code} onChange={(e) => set("zip_code", e.target.value)}
                  className={cls} placeholder="123 45" />
              </Field>
              <Field label="Ort">
                <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)}
                  className={cls} placeholder="Stockholm" />
              </Field>
              <Field label="Land">
                <input type="text" value={form.country} onChange={(e) => set("country", e.target.value)}
                  className={cls} />
              </Field>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Kontaktuppgifter</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="E-post">
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  className={cls} placeholder="info@foretag.se" />
              </Field>
              <Field label="Telefon">
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className={cls} placeholder="08-000 000" />
              </Field>
            </div>
          </div>

          {/* Betalning */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Betalningsinformation</h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              <Field label="Bankgiro">
                <input type="text" value={form.bankgiro} onChange={(e) => set("bankgiro", e.target.value)}
                  className={cls} placeholder="000-0000" />
              </Field>
              <Field label="Plusgiro">
                <input type="text" value={form.plusgiro} onChange={(e) => set("plusgiro", e.target.value)}
                  className={cls} placeholder="00000-0" />
              </Field>
              <Field label="Betalningsvillkor (dagar)">
                <input type="number" min={0} max={365} value={form.payment_terms}
                  onChange={(e) => set("payment_terms", parseInt(e.target.value) || 30)}
                  className={cls + " text-right"} />
              </Field>
            </div>
          </div>

          {/* Anteckningar */}
          <div>
            <Field label="Anteckningar">
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
                rows={2} className={cls + " resize-none"} placeholder="Interna anteckningar om leverantören…" />
            </Field>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors">
              Avbryt
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-1.5 text-sm bg-violet-600 text-white rounded font-medium hover:bg-violet-700 disabled:opacity-60 transition-colors">
              {saving ? "Sparar…" : isEdit ? "Spara ändringar" : "Lägg till"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
