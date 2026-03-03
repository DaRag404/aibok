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

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}
