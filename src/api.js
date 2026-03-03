const BASE_URL = "http://localhost:8000";

export async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Okänt fel från servern");
  }

  return res.json();
}

export async function bookInvoice(invoiceData, lines, pdfFile) {
  const formData = new FormData();
  formData.append("invoice_data", JSON.stringify({ ...invoiceData, lines }));
  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }

  const res = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Bokföring misslyckades");
  }

  return res.json();
}

export async function fetchInvoices() {
  const res = await fetch(`${BASE_URL}/invoices`);
  if (!res.ok) throw new Error("Kunde inte hämta fakturor");
  return res.json();
}

export function invoicePdfUrl(id) {
  return `${BASE_URL}/invoices/${id}/pdf`;
}

export async function fetchSuppliers() {
  const res = await fetch(`${BASE_URL}/suppliers`);
  if (!res.ok) throw new Error("Kunde inte hämta leverantörer");
  return res.json();
}

export async function createSupplier(data) {
  const res = await fetch(`${BASE_URL}/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Kunde inte spara leverantören");
  }
  return res.json();
}

export async function updateSupplier(id, data) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Kunde inte uppdatera leverantören");
  }
  return res.json();
}

export async function deleteSupplier(id) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Kunde inte ta bort leverantören");
}

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}
