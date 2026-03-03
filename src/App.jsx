import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DropZone from "./components/DropZone";
import InvoiceForm from "./components/InvoiceForm";
import AccountingEntries from "./components/AccountingEntries";
import Summary from "./components/Summary";
import PeriodizationModal from "./components/PeriodizationModal";
import InvoiceList from "./components/InvoiceList";
import SupplierList from "./components/SupplierList";
import { uploadInvoice, bookInvoice, updateInvoice } from "./api";

const NAV_TO_VIEW = {
  leverantorsfakturor: "list",
  leverantorer: "suppliers",
};

const EMPTY_INVOICE = {
  supplier: "",
  is_credit: false,
  skip_payment: false,
  invoice_date: "",
  due_date: "",
  invoice_number: "",
  total_amount: "",
  vat_amount: "",
  currency: "SEK",
  message: "",
};

export default function App() {
  const [activeNav, setActiveNav] = useState("leverantorsfakturor");
  const [view, setView] = useState("list"); // "list" | "new" | "suppliers"

  const [invoiceData, setInvoiceData] = useState(null);
  const [lines, setLines] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [editingId, setEditingId] = useState(null); // null = new, number = editing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showPeriodize, setShowPeriodize] = useState(false);

  const handleNavigate = (id) => {
    const mappedView = NAV_TO_VIEW[id];
    if (mappedView) {
      setActiveNav(id);
      setView(mappedView);
    }
  };

  const openNewInvoice = () => {
    setEditingId(null);
    setInvoiceData({ ...EMPTY_INVOICE });
    setLines([{ account: "", vat_code: "MP1", net_amount: "" }]);
    setPdfFile(null);
    setError(null);
    setBookingStatus(null);
    setView("new");
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice.id);
    setInvoiceData({
      supplier: invoice.supplier ?? "",
      is_credit: invoice.is_credit ?? false,
      skip_payment: invoice.skip_payment ?? false,
      invoice_date: invoice.invoice_date ?? "",
      due_date: invoice.due_date ?? "",
      invoice_number: invoice.invoice_number ?? "",
      total_amount: invoice.total_amount ?? "",
      vat_amount: invoice.vat_amount ?? "",
      currency: invoice.currency ?? "SEK",
      message: invoice.message ?? "",
    });
    setLines((invoice.lines ?? []).map((l) => ({
      account: l.account,
      vat_code: l.vat_code,
      net_amount: l.net_amount,
    })));
    setPdfFile(null);
    setError(null);
    setBookingStatus(null);
    setView("new");
  };

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setPdfFile(file);
    try {
      const data = await uploadInvoice(file);
      setInvoiceData(data);
      setLines(data.lines || []);
      setBookingStatus(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async () => {
    setBookingStatus("saving");
    setError(null);
    try {
      if (editingId) {
        await updateInvoice(editingId, invoiceData, lines, pdfFile);
      } else {
        await bookInvoice(invoiceData, lines, pdfFile);
      }
      setBookingStatus("saved");
      setTimeout(() => {
        setInvoiceData(null);
        setLines([]);
        setPdfFile(null);
        setEditingId(null);
        setBookingStatus(null);
        setView("list");
        setActiveNav("leverantorsfakturor");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setBookingStatus("error");
    }
  };

  const handleCancel = () => {
    setInvoiceData(null);
    setLines([]);
    setPdfFile(null);
    setEditingId(null);
    setError(null);
    setBookingStatus(null);
    setView("list");
    setActiveNav("leverantorsfakturor");
  };

  const invoiceTotal = parseFloat(invoiceData?.total_amount) || 0;
  const invoiceVat = parseFloat(invoiceData?.vat_amount) || 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      <Sidebar activeId={activeNav} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        {view === "list" ? (
          <InvoiceList onNew={openNewInvoice} onEdit={handleEdit} />
        ) : view === "suppliers" ? (
          <SupplierList />
        ) : (
          <>
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Tillbaka"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-base font-semibold text-gray-800">
                  {editingId ? "Redigera leverantörsfaktura" : "Ny leverantörsfaktura"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <DropZone onUpload={handleUpload} isLoading={isLoading} compact />
                {error && (
                  <span className="text-xs text-red-600 max-w-xs truncate" title={error}>{error}</span>
                )}
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="bg-white mx-6 my-5 rounded border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-100">
                  <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
                </div>
                <div className="px-6 py-4">
                  <AccountingEntries
                    lines={lines}
                    invoiceTotal={invoiceTotal}
                    vatAmount={invoiceVat}
                    onChange={setLines}
                  />
                </div>
                <div className="px-6 py-5 border-t border-gray-100">
                  <div className="flex justify-end">
                    <div className="w-80">
                      <Summary
                        lines={lines}
                        invoiceTotal={invoiceTotal}
                        invoiceVat={invoiceVat}
                        currency={invoiceData?.currency || "SEK"}
                        onBook={handleBook}
                        onCancel={handleCancel}
                        onPeriodize={() => setShowPeriodize(true)}
                        bookingStatus={bookingStatus}
                        isEditing={!!editingId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {showPeriodize && (
        <PeriodizationModal
          invoiceData={invoiceData}
          onClose={() => setShowPeriodize(false)}
        />
      )}
    </div>
  );
}
