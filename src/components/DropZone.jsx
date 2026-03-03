import { useRef, useState } from "react";

export default function DropZone({ onUpload, isLoading, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Välj en PDF-fil.");
      return;
    }
    setFileName(file.name);
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // Compact mode: small button in header bar
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
        <button
          disabled={isLoading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded
            text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-violet-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analyserar…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {fileName ? fileName : "Ladda upp PDF"}
            </>
          )}
        </button>
      </div>
    );
  }

  // Full drag-and-drop zone
  return (
    <div
      onClick={() => !isLoading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8
        cursor-pointer transition-colors select-none
        ${isDragging ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <input ref={inputRef} type="file" accept=".pdf" className="hidden"
        onChange={(e) => handleFile(e.target.files[0])} />
      {isLoading ? (
        <div className="flex flex-col items-center gap-2 text-violet-600">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-medium">Analyserar faktura…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {fileName
            ? <span className="text-sm font-medium text-violet-600 truncate max-w-xs">{fileName}</span>
            : <>
                <span className="text-sm font-medium">Dra in PDF här</span>
                <span className="text-xs text-gray-400">eller klicka för att välja fil</span>
              </>
          }
        </div>
      )}
    </div>
  );
}
