import { useState } from "react";
import { ACCOUNTS, VAT_CODES, VAT_RATE, VAT_ACCOUNT, SYSTEM_ACCOUNT_NAMES, computeAutoRows } from "../bas_accounts";

const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// Searchable account dropdown (cost accounts only)
function AccountSelect({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const name = ACCOUNTS.find((a) => a.code === value)?.name ?? "";
  const displayValue = open ? query : value ? `${value} - ${name}` : "";

  const filtered = ACCOUNTS.filter(
    (a) =>
      a.code.startsWith(query) ||
      a.code.includes(query) ||
      a.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 40);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={displayValue}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ange konto eller sökord"
        className="w-full border border-gray-300 rounded px-2.5 py-1 text-sm bg-white
          focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
      />
      {open && (
        <ul className="absolute z-20 mt-0.5 max-h-56 w-80 overflow-auto rounded border
          border-gray-200 bg-white shadow-lg text-sm">
          {filtered.map((a) => (
            <li
              key={a.code}
              onMouseDown={() => { onChange(a.code); setOpen(false); }}
              className="flex gap-2 cursor-pointer px-3 py-1.5 hover:bg-blue-50"
            >
              <span className="font-mono text-gray-700 w-12 shrink-0">{a.code}</span>
              <span className="text-gray-600 truncate">{a.name}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-gray-400">Inga träffar</li>
          )}
        </ul>
      )}
    </div>
  );
}

// Read-only auto-generated row (2440, 2641 etc.)
function AutoRow({ account, amount }) {
  const name = SYSTEM_ACCOUNT_NAMES[account] ?? account;
  return (
    <tr className="border-t border-gray-100 bg-gray-50">
      <td className="px-3 py-1.5">
        <div className="flex items-center border border-gray-200 rounded px-2.5 py-1 text-sm
          bg-gray-50 text-gray-500 select-none">
          <span className="font-mono w-12 shrink-0 text-gray-400">{account}</span>
          <span className="ml-1 truncate">{name}</span>
        </div>
      </td>
      <td className="px-2 py-1.5 w-28">
        <div className="border border-gray-200 rounded px-2 py-1 text-sm bg-gray-50
          text-gray-400 select-none text-center">—</div>
      </td>
      <td className="px-2 py-1.5 w-36">
        <div className="border border-gray-200 rounded px-2.5 py-1 text-sm bg-gray-50
          text-gray-500 text-right select-none tabular-nums">
          {fmt(amount)}
        </div>
      </td>
      <td className="w-16" />
    </tr>
  );
}

// Editable cost row
function LineRow({ line, onChange, onAdd, onRemove }) {
  const set = (field, value) => onChange({ ...line, [field]: value });
  const inputCls = "w-full border border-gray-300 rounded px-2.5 py-1 text-sm bg-white " +
    "focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200";

  return (
    <tr className="border-t border-gray-100">
      <td className="px-3 py-1.5">
        <AccountSelect value={line.account} onChange={(v) => set("account", v)} />
      </td>
      <td className="px-2 py-1.5 w-28">
        <select
          value={line.vat_code || ""}
          onChange={(e) => set("vat_code", e.target.value)}
          className={inputCls}
        >
          <option value=""></option>
          {VAT_CODES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </td>
      <td className="px-2 py-1.5 w-36">
        <input
          type="number" step="0.01"
          value={line.net_amount ?? ""}
          onChange={(e) => set("net_amount", parseFloat(e.target.value) || 0)}
          className={inputCls + " text-right"}
        />
      </td>
      <td className="px-1 py-1.5 w-16 whitespace-nowrap">
        <button onClick={onAdd}
          className="w-6 h-6 rounded border border-gray-300 text-gray-500
            hover:border-blue-400 hover:text-blue-600 text-base leading-none"
          title="Lägg till rad">+</button>
        <button onClick={onRemove}
          className="w-6 h-6 ml-1 rounded border border-gray-300 text-gray-500
            hover:border-red-400 hover:text-red-600 text-base leading-none"
          title="Ta bort rad">−</button>
      </td>
    </tr>
  );
}

export default function AccountingEntries({ lines = [], invoiceTotal = 0, vatAmount = 0, onChange }) {
  const autoRows = computeAutoRows(lines, invoiceTotal, vatAmount);

  const addRow = (afterIndex) => {
    const next = [...lines];
    next.splice(afterIndex + 1, 0, { account: "", vat_code: "MP1", net_amount: 0 });
    onChange(next);
  };

  const updateRow = (i, updated) => {
    const next = [...lines];
    next[i] = updated;
    onChange(next);
  };

  const removeRow = (i) => {
    if (lines.length <= 1) return;
    onChange(lines.filter((_, idx) => idx !== i));
  };

  const hasContent = lines.length > 0 || invoiceTotal > 0;

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="px-3 pb-2 pt-1 text-left text-xs font-medium text-gray-500">Konto</th>
          <th className="px-2 pb-2 pt-1 text-left text-xs font-medium text-gray-500 w-28">Momskod</th>
          <th className="px-2 pb-2 pt-1 text-right text-xs font-medium text-gray-500 w-36">Belopp exkl moms</th>
          <th className="w-16" />
        </tr>
      </thead>
      <tbody>
        {/* Auto-generated rows (grayed out) */}
        {hasContent && autoRows.map((row) => (
          <AutoRow key={row.account} account={row.account} amount={row.amount} />
        ))}

        {/* Editable cost rows */}
        {lines.map((line, i) => (
          <LineRow
            key={i}
            line={line}
            onChange={(updated) => updateRow(i, updated)}
            onAdd={() => addRow(i)}
            onRemove={() => removeRow(i)}
          />
        ))}

        {!hasContent && (
          <tr>
            <td colSpan={4} className="px-3 py-8 text-center text-gray-400 text-sm">
              Ladda upp en faktura för att autofylla konteringsrader.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
