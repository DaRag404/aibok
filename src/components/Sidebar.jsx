import { useState } from "react";

// --- Icon components ---

const Icon = ({ name, className = "h-4 w-4" }) => {
  const paths = {
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
    tag: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    ),
    inbox: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    cog: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    cash: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
    dots: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    ),
    chevron: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 9l-7 7-7-7" />
    ),
    bank: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    ),
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {paths[name] ?? paths.dots}
    </svg>
  );
};

// --- Nav data ---

const NAV = [
  {
    type: "link",
    id: "overview",
    label: "Översikt",
    icon: "home",
  },
  {
    type: "section",
    id: "forsaljning",
    label: "Försäljning",
    icon: "tag",
    children: [
      { id: "kundfakturor", label: "Kundfakturor" },
      { id: "kunder", label: "Kunder" },
      { id: "offerter", label: "Offerter" },
    ],
  },
  {
    type: "section",
    id: "inkop",
    label: "Inköp",
    icon: "inbox",
    children: [
      { id: "leverantorsfakturor", label: "Leverantörsfakturor" },
      { id: "leverantorer", label: "Leverantörer", disabled: true },
      { id: "bildunderlag", label: "Bildunderlag", disabled: true },
    ],
  },
  {
    type: "section",
    id: "lon",
    label: "Lön",
    icon: "users",
    children: [
      { id: "kassa-bank", label: "Kassa- och bankhändelser" },
      { id: "loneposter", label: "Löneposter", disabled: true },
    ],
  },
  {
    type: "section",
    id: "bokforing",
    label: "Bokföring",
    icon: "book",
    children: [
      { id: "verifikationer", label: "Verifikationer", disabled: true },
      { id: "balansrapport", label: "Balansrapport", disabled: true },
      { id: "resultatrapport", label: "Resultatrapport", disabled: true },
    ],
  },
  {
    type: "section",
    id: "installningar",
    label: "Inställningar",
    icon: "cog",
    children: [
      { id: "foretagsinfo", label: "Företagsinformation", disabled: true },
      { id: "anvandare", label: "Användare", disabled: true },
    ],
  },
  {
    type: "link",
    id: "deklaration",
    label: "Deklaration",
    icon: "document",
    badge: "Aktuellt",
  },
  {
    type: "link",
    id: "finansiering",
    label: "Finansiering",
    icon: "cash",
  },
  {
    type: "link",
    id: "fler",
    label: "Fler funktioner",
    icon: "dots",
  },
];

// --- Sub-components ---

function SidebarChild({ item, isActive, onClick }) {
  if (item.disabled) {
    return (
      <span className="flex items-center pl-9 pr-4 py-1.5 text-sm text-gray-300 cursor-default select-none">
        {item.label}
      </span>
    );
  }
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full text-left flex items-center pl-9 pr-4 py-1.5 text-sm rounded-r transition-colors ${
        isActive
          ? "text-violet-700 font-medium bg-violet-50 border-r-2 border-violet-600"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
      }`}
    >
      {item.label}
    </button>
  );
}

function SidebarSection({ item, activeId, onNavigate, defaultOpen = false }) {
  const hasActiveChild = item.children?.some((c) => c.id === activeId);
  const [open, setOpen] = useState(defaultOpen || hasActiveChild);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-sm transition-colors group ${
          hasActiveChild
            ? "text-gray-800 font-medium"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        }`}
      >
        <Icon name={item.icon} className={`h-4 w-4 shrink-0 ${hasActiveChild ? "text-violet-600" : "text-gray-400 group-hover:text-gray-500"}`} />
        <span className="flex-1 text-left">{item.label}</span>
        <Icon
          name="chevron"
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="mt-0.5 mb-1">
          {item.children.map((child) => (
            <SidebarChild
              key={child.id}
              item={child}
              isActive={activeId === child.id}
              onClick={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarLink({ item, isActive, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-sm transition-colors group ${
        isActive
          ? "text-violet-700 font-medium bg-violet-50 border-r-2 border-violet-600"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      }`}
    >
      <Icon
        name={item.icon}
        className={`h-4 w-4 shrink-0 ${isActive ? "text-violet-600" : "text-gray-400 group-hover:text-gray-500"}`}
      />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-700 leading-none">
          {item.badge}
        </span>
      )}
    </button>
  );
}

// --- Main Sidebar ---

export default function Sidebar({ activeId, onNavigate }) {
  // Determine which sections start open
  const openSectionIds = NAV
    .filter((item) => item.type === "section")
    .filter((item) => item.children?.some((c) => c.id === activeId))
    .map((item) => item.id);

  return (
    <nav className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 select-none">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-[11px] tracking-tight">ai</span>
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm leading-tight">aibok</div>
            <div className="text-[10px] text-gray-400 leading-tight">Ekonomisystem</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV.map((item) =>
          item.type === "section" ? (
            <SidebarSection
              key={item.id}
              item={item}
              activeId={activeId}
              onNavigate={onNavigate}
              defaultOpen={openSectionIds.includes(item.id)}
            />
          ) : (
            <SidebarLink
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onNavigate={onNavigate}
            />
          )
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Lokal AI · ingen data lämnar datorn
        </div>
      </div>
    </nav>
  );
}
