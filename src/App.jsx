import { useState } from "react";
import DropZone from "./components/DropZone";
import InvoiceForm from "./components/InvoiceForm";
import AccountingEntries from "./components/AccountingEntries";
import Summary from "./components/Summary";
import PeriodizationModal from "./components/PeriodizationModal";
import InvoiceList from "./components/InvoiceList";
import { uploadInvoice, bookInvoice } from "./api";

export default function App() {
  const [view, setView] = useState("list"); // "list" | "new"
  const [invoiceData, setInvoiceData] = useState(null);
  const [lines, setLines] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showPeriodize, setShowPeriodize] = useState(false);

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
      await bookInvoice(invoiceData, lines, pdfFile);
      setBookingStatus("saved");
      setTimeout(() => {
        setInvoiceData(null);
        setLines([]);
        setPdfFile(null);
        setBookingStatus(null);
        setView("list");
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
    setError(null);
    setBookingStatus(null);
    setView("list");
  };

  const invoiceTotal = parseFloat(invoiceData?.total_amount) || 0;

  const navItem = (label, targetView, enabled = true) => {
    const active = view === targetView;
    if (!enabled) {
      return (
        <span className="flex items-center px-4 py-1.5 text-gray-400 cursor-default select-none text-sm">
          {label}
        </span>
      );
    }
    return (
      <a
        onClick={() => setView(targetView)}
        className={`flex items-center px-4 py-1.5 text-sm cursor-pointer select-none transition-colors ${
          active
            ? "text-gray-800 bg-violet-50 border-r-2 border-violet-600 font-medium"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Left nav */}
      <nav className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">ai</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">aibok</span>
          </div>
        </div>
        <div className="flex-1 py-3 text-sm">
          <div className="px-3 py-1.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Inköp</div>
          {navItem("Leverantörsfakturor", "list")}
          {navItem("Leverantörer", null, false)}
          {navItem("Bildunderlag", null, false)}
        </div>
        <div className="p-3 text-xs text-gray-400 text-center border-t border-gray-100">
          Lokal AI · ingen data lämnar datorn
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {view === "list" ? (
          <InvoiceList onNew={() => setView("new")} />
        ) : (
          <>
            {/* Top bar */}
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
                <h1 className="text-base font-semibold text-gray-800">Ny leverantörsfaktura</h1>
              </div>
              <div className="flex items-center gap-3">
                <DropZone onUpload={handleUpload} isLoading={isLoading} compact />
                {error && (
                  <span className="text-xs text-red-600 max-w-xs truncate" title={error}>{error}</span>
                )}
              </div>
            </header>

            {/* Form */}
            <main className="flex-1 overflow-auto">
              <div className="bg-white mx-6 my-5 rounded border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-100">
                  <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
                </div>
                <div className="px-6 py-4">
                  <AccountingEntries
                    lines={lines}
                    invoiceTotal={invoiceTotal}
                    onChange={setLines}
                  />
                </div>
                <div className="px-6 py-5 border-t border-gray-100">
                  <div className="flex justify-end">
                    <div className="w-80">
                      <Summary
                        lines={lines}
                        invoiceTotal={invoiceTotal}
                        currency={invoiceData?.currency || "SEK"}
                        onBook={handleBook}
                        onCancel={handleCancel}
                        onPeriodize={() => setShowPeriodize(true)}
                        bookingStatus={bookingStatus}
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
