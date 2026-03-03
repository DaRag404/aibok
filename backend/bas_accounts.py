# BAS kontoplan 2025 – relevant för leverantörsfakturor
# Källa: bas.se

ACCOUNTS = {
    # === KLASS 1: TILLGÅNGAR (bankkonton som används vid bokföring) ===
    "1910": "Kassa",
    "1920": "PlusGiro",
    "1930": "Företagskonto / checkräkningskonto",
    "1940": "Övriga bankkonton",
    "1960": "Valutakonton",

    # === KLASS 2: SKULDER OCH EGET KAPITAL ===
    "2390": "Övriga kortfristiga skulder",
    "2440": "Leverantörsskulder",
    "2441": "Leverantörsskulder, ej reskontra",
    "2640": "Ingående moms",
    "2641": "Ingående moms 25 %",
    "2642": "Ingående moms 12 %",
    "2643": "Ingående moms 6 %",
    "2645": "Beräknad ingående moms på förvärv från utlandet",
    "2650": "Redovisningskonto för moms",
    "2651": "Momsskuld",

    # === KLASS 4: VAROR, MATERIAL OCH KÖPTA TJÄNSTER ===
    "4000": "Inköp av varor från Sverige",
    "4010": "Inköp av handelsvaror, 25 % moms",
    "4012": "Inköp av handelsvaror, 12 % moms",
    "4013": "Inköp av handelsvaror, 6 % moms",
    "4100": "Varor och material",
    "4200": "Råvaror",
    "4300": "Halvfabrikat",
    "4400": "Momspliktiga inköp i Sverige",
    "4415": "Inköp av tjänster i Sverige med omvänd skattskyldighet",
    "4500": "Inköp av varor från EU",
    "4516": "Inköp av tjänster från EU",
    "4530": "Inköp av varor från land utanför EU",
    "4531": "Inköp av tjänster från land utanför EU",
    "4600": "Legoarbeten och underentreprenader",
    "4700": "Reduktion av inköpspriser",
    "4730": "Erhållna rabatter på varuinköp",
    "4900": "Förändring av lager",
    "4910": "Råvaruförbrukning",
    "4920": "Förbrukning halvfabrikat",

    # === KLASS 5: ÖVRIGA EXTERNA RÖRELSEUTGIFTER ===

    # Lokalkostnader (50)
    "5010": "Lokalhyra",
    "5011": "Hyra för kontorslokal",
    "5012": "Hyra för lagerlokal",
    "5020": "El för belysning",
    "5030": "Värme",
    "5040": "Vatten och avlopp",
    "5060": "Städning och renhållning",
    "5090": "Övriga lokalkostnader",

    # Fastighetskostnader (51)
    "5110": "Tomträttsavgäld och arrende",
    "5130": "Fastighetsskatt och fastighetsavgift",
    "5170": "Reparation och underhåll av fastighet",
    "5190": "Övriga fastighetskostnader",

    # Hyra av anläggningstillgångar (52)
    "5210": "Hyra av maskiner och andra tekniska anläggningar",
    "5220": "Hyra av inventarier och verktyg",
    "5230": "Hyra av datorer",
    "5250": "Hyra av bilar och andra transportmedel",
    "5290": "Övrig hyra",

    # Energikostnader (53)
    "5310": "Elkraft",
    "5320": "Gas",
    "5330": "Eldningsolja",
    "5390": "Övriga energikostnader",

    # Förbrukningsinventarier och förbrukningsmaterial (54)
    "5400": "Förbrukningsinventarier och förbrukningsmaterial",
    "5410": "Förbrukningsinventarier",
    "5412": "Programvaror (förbrukningsinventarier)",
    "5420": "Programvaror och licenser",
    "5440": "Förbrukningsmaterial",
    "5460": "Förbrukningsinventarier för IT",
    "5480": "Datatjänster och molntjänster",
    "5490": "Övriga IT-kostnader",

    # Reparation och underhåll (55)
    "5510": "Reparation och underhåll av maskiner",
    "5520": "Reparation och underhåll av inventarier",
    "5530": "Reparation och underhåll av datorer",
    "5590": "Övrig reparation och underhåll",

    # Transportmedel (56)
    "5610": "Bensin och dieselolja",
    "5612": "Drivmedel, tjänstebilar",
    "5620": "Bilkostnader",
    "5630": "Trailerkostnader",
    "5650": "Tull- och speditionskostnader",
    "5690": "Övriga kostnader för transportmedel",

    # Frakter och transporter (57)
    "5710": "Frakter och transporter på varor",
    "5720": "Tullkostnader",
    "5790": "Övriga frakter och transporter",

    # Resekostnader (58)
    "5800": "Resekostnader",
    "5810": "Biljetter",
    "5820": "Hyrbilskostnader",
    "5830": "Kost och logi",
    "5890": "Övriga resekostnader",

    # Reklam och PR (59)
    "5900": "Reklam och PR",
    "5910": "Annonsering",
    "5920": "Utställningar och mässor",
    "5930": "Reklamtrycksaker",
    "5940": "Reklamartiklar och gåvor",
    "5990": "Övrig reklam och PR",

    # === KLASS 6: ÖVRIGA EXTERNA KOSTNADER ===

    # Övriga försäljningskostnader (60)
    "6010": "Kataloger och prislistor",
    "6040": "Kontokortsavgifter",
    "6050": "Försäljningsprovisioner",
    "6055": "Franchisekostnader",
    "6060": "Kreditförsäljningskostnader",
    "6070": "Representation",
    "6071": "Representation, avdragsgill",
    "6072": "Representation, ej avdragsgill",
    "6090": "Övriga försäljningskostnader",

    # Kontorsmateriel och trycksaker (61)
    "6100": "Kontorsmateriel och trycksaker",
    "6110": "Kontorsmateriel",
    "6150": "Trycksaker",

    # Tele och post (62)
    "6200": "Tele och post",
    "6210": "Telekommunikation",
    "6212": "Mobiltelefon",
    "6220": "Internetabonnemang",
    "6230": "Datakommunikation",
    "6250": "Postbefordran",

    # Försäkringar (63)
    "6300": "Företagsförsäkringar",
    "6310": "Förmögenhetsskadeförsäkring",
    "6320": "Ansvarsförsäkring",
    "6330": "Motorfordonsförsäkring",
    "6390": "Övriga företagsförsäkringar",

    # Förvaltningskostnader (64)
    "6400": "Styrelsekostnader",
    "6410": "Styrelsearvoden",
    "6411": "Styrelsearvoden, ej avdragsgilla",
    "6420": "Revisionsarvoden",
    "6430": "Redovisningskonsulter",
    "6440": "Årsredovisning",
    "6450": "Styrelsearvoden (externt)",
    "6490": "Övriga förvaltningskostnader",

    # Övriga externa tjänster (65)
    "6500": "Övriga externa tjänster",
    "6510": "Konsultarvoden",
    "6520": "Juridisk rådgivning",
    "6530": "Redovisningstjänster",
    "6540": "IT-konsulter",
    "6550": "Övriga konsulttjänster",
    "6560": "Faktureringstjänster",
    "6570": "Bankkostnader",
    "6580": "Inkasso och kreditupplysning",
    "6590": "Övriga externa tjänster",

    # Inhyrd personal (68)
    "6800": "Inhyrd personal",
    "6810": "Bemanningsföretag",
    "6890": "Övriga kostnader för inhyrd personal",

    # Övriga externa kostnader (69)
    "6900": "Övriga externa kostnader",
    "6910": "Licenser och royalties",
    "6920": "Tidningar, tidskrifter och facklitteratur",
    "6930": "Konferenser och kurser",
    "6940": "Kontors- och förvaltningskostnader",
    "6950": "Föreningsavgifter",
    "6970": "Kostnader för betalningsförmedling",
    "6990": "Övriga externa kostnader",
}

# Momskoder
VAT_CODES = {
    "MP1": "25 % moms",
    "MP2": "12 % moms",
    "MP3": "6 % moms",
    "MF":  "Momsfritt",
}

# Momssats per kod
VAT_RATE = {
    "MP1": 0.25,
    "MP2": 0.12,
    "MP3": 0.06,
    "MF":  0.00,
    "":    0.00,
}

# Moms-konto per momskod
VAT_ACCOUNT = {
    "MP1": "2641",
    "MP2": "2642",
    "MP3": "2643",
}

# Komprimerad lista för LLM-prompt (kostnadskonton + bankkonton, ej moms/AP-konton)
COST_ACCOUNTS_FOR_PROMPT = "\n".join(
    f"  {code}: {name}"
    for code, name in ACCOUNTS.items()
    if not code.startswith("2") and not code.startswith("265")
)
