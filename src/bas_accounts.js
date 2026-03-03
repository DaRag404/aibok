// BAS kontoplan 2025 – kostnadskonton för leverantörsfakturor
export const ACCOUNTS = [
  // Klass 4
  { code: "4010", name: "Inköp av handelsvaror, 25 % moms" },
  { code: "4012", name: "Inköp av handelsvaror, 12 % moms" },
  { code: "4013", name: "Inköp av handelsvaror, 6 % moms" },
  { code: "4400", name: "Momspliktiga inköp i Sverige" },
  { code: "4415", name: "Inköp av tjänster, omvänd skattskyldighet" },
  { code: "4500", name: "Inköp av varor från EU" },
  { code: "4516", name: "Inköp av tjänster från EU" },
  { code: "4530", name: "Inköp av varor från land utanför EU" },
  { code: "4531", name: "Inköp av tjänster från land utanför EU" },
  { code: "4600", name: "Legoarbeten och underentreprenader" },
  { code: "4700", name: "Reduktion av inköpspriser" },
  // Klass 5
  { code: "5010", name: "Lokalhyra" },
  { code: "5011", name: "Hyra för kontorslokal" },
  { code: "5020", name: "El för belysning" },
  { code: "5030", name: "Värme" },
  { code: "5040", name: "Vatten och avlopp" },
  { code: "5060", name: "Städning och renhållning" },
  { code: "5090", name: "Övriga lokalkostnader" },
  { code: "5170", name: "Reparation och underhåll av fastighet" },
  { code: "5210", name: "Hyra av maskiner och tekniska anläggningar" },
  { code: "5220", name: "Hyra av inventarier och verktyg" },
  { code: "5230", name: "Hyra av datorer" },
  { code: "5250", name: "Hyra av bilar och transportmedel" },
  { code: "5290", name: "Övrig hyra" },
  { code: "5310", name: "Elkraft" },
  { code: "5320", name: "Gas" },
  { code: "5400", name: "Förbrukningsinventarier och förbrukningsmaterial" },
  { code: "5410", name: "Förbrukningsinventarier" },
  { code: "5412", name: "Programvaror (förbrukningsinventarier)" },
  { code: "5420", name: "Programvaror" },
  { code: "5440", name: "Förbrukningsmaterial" },
  { code: "5460", name: "Förbrukningsinventarier för IT" },
  { code: "5480", name: "Datatjänster och molntjänster" },
  { code: "5490", name: "Övriga IT-kostnader" },
  { code: "5510", name: "Reparation och underhåll av maskiner" },
  { code: "5520", name: "Reparation och underhåll av inventarier" },
  { code: "5530", name: "Reparation och underhåll av datorer" },
  { code: "5590", name: "Övrig reparation och underhåll" },
  { code: "5610", name: "Bensin och dieselolja" },
  { code: "5612", name: "Drivmedel, tjänstebilar" },
  { code: "5620", name: "Bilkostnader" },
  { code: "5650", name: "Tull- och speditionskostnader" },
  { code: "5710", name: "Frakter och transporter på varor" },
  { code: "5800", name: "Resekostnader" },
  { code: "5810", name: "Biljetter" },
  { code: "5820", name: "Hyrbilskostnader" },
  { code: "5830", name: "Kost och logi" },
  { code: "5890", name: "Övriga resekostnader" },
  { code: "5900", name: "Reklam och PR" },
  { code: "5910", name: "Annonsering" },
  { code: "5920", name: "Utställningar och mässor" },
  { code: "5930", name: "Reklamtrycksaker" },
  // Klass 6
  { code: "6040", name: "Kontokortsavgifter" },
  { code: "6050", name: "Försäljningsprovisioner" },
  { code: "6070", name: "Representation" },
  { code: "6071", name: "Representation, avdragsgill" },
  { code: "6072", name: "Representation, ej avdragsgill" },
  { code: "6090", name: "Övriga försäljningskostnader" },
  { code: "6110", name: "Kontorsmateriel" },
  { code: "6150", name: "Trycksaker" },
  { code: "6210", name: "Telekommunikation" },
  { code: "6212", name: "Mobiltelefon" },
  { code: "6220", name: "Internetabonnemang" },
  { code: "6230", name: "Datakommunikation" },
  { code: "6250", name: "Postbefordran" },
  { code: "6310", name: "Förmögenhetsskadeförsäkring" },
  { code: "6320", name: "Ansvarsförsäkring" },
  { code: "6330", name: "Motorfordonsförsäkring" },
  { code: "6390", name: "Övriga företagsförsäkringar" },
  { code: "6420", name: "Revisionsarvoden" },
  { code: "6430", name: "Redovisningskonsulter" },
  { code: "6440", name: "Årsredovisning" },
  { code: "6450", name: "Styrelsearvoden" },
  { code: "6490", name: "Övriga förvaltningskostnader" },
  { code: "6510", name: "Konsultarvoden" },
  { code: "6520", name: "Juridisk rådgivning" },
  { code: "6530", name: "Redovisningstjänster" },
  { code: "6540", name: "IT-konsulter" },
  { code: "6550", name: "Övriga konsulttjänster" },
  { code: "6570", name: "Bankkostnader" },
  { code: "6580", name: "Inkasso och kreditupplysning" },
  { code: "6590", name: "Övriga externa tjänster" },
  { code: "6800", name: "Inhyrd personal" },
  { code: "6810", name: "Bemanningsföretag" },
  { code: "6910", name: "Licenser och royalties" },
  { code: "6920", name: "Tidningar, tidskrifter och facklitteratur" },
  { code: "6930", name: "Konferenser och kurser" },
  { code: "6950", name: "Föreningsavgifter" },
  { code: "6970", name: "Kostnader för betalningsförmedling" },
  { code: "6990", name: "Övriga externa kostnader" },
];

// Momskoder (BAS)
export const VAT_CODES = ["MP1", "MP2", "MP3", "MF"];

// Momssats per kod
export const VAT_RATE = {
  MP1: 0.25,
  MP2: 0.12,
  MP3: 0.06,
  MF: 0.0,
  "": 0.0,
};

// Automatiska momsreskontrakonton per momskod
export const VAT_ACCOUNT = {
  MP1: "2641",
  MP2: "2642",
  MP3: "2643",
};

// Namn för systemkonton (visas i auto-rader)
export const SYSTEM_ACCOUNT_NAMES = {
  "2440": "Leverantörsskulder",
  "2641": "Debiterad ingående moms",
  "2642": "Ingående moms 12 %",
  "2643": "Ingående moms 6 %",
};

// Beräkna auto-rader (moms + leverantörsskuld).
// vatAmount från fakturahuvudet styr momsbeloppet;
// linjer med momskod bestämmer fördelningen mellan 2641/2642/2643.
export function computeAutoRows(lines, invoiceTotal, vatAmount) {
  const vat = parseFloat(vatAmount) || 0;

  // Beräkna vikter per momskonto baserat på netto * sats
  const weightByAccount = {};
  let totalWeight = 0;
  for (const line of lines) {
    const rate = VAT_RATE[line.vat_code] ?? 0;
    if (rate > 0) {
      const account = VAT_ACCOUNT[line.vat_code];
      const w = (parseFloat(line.net_amount) || 0) * rate;
      weightByAccount[account] = (weightByAccount[account] ?? 0) + w;
      totalWeight += w;
    }
  }

  let vatRows = [];
  if (vat !== 0) {
    if (totalWeight > 0) {
      // Fördela vatAmount proportionellt
      vatRows = Object.entries(weightByAccount).map(([account, w]) => ({
        account,
        amount: round2(vat * (w / totalWeight)),
        auto: true,
      }));
    } else {
      // Inga momskoder i linjer ännu → default 2641
      vatRows = [{ account: "2641", amount: round2(vat), auto: true }];
    }
  }

  // Leverantörsskuld = negativt totalbelopp (kredit)
  const total = parseFloat(invoiceTotal) || 0;
  return [
    { account: "2440", amount: -round2(total), auto: true },
    ...vatRows,
  ];
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function accountName(code) {
  return ACCOUNTS.find((a) => a.code === code)?.name ?? SYSTEM_ACCOUNT_NAMES[code] ?? "";
}
