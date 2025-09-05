/**
 * Programma Incarichi - PDF Schedule Parser
 * Carica un PDF, estrae il testo usando pdf.js e popola la tabella degli incarichi
 */

// ===== COSTANTI GLOBALI =====
const PDF_CDN_URL = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.min.js";
const PDF_WORKER_URL =
  "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";

const MONTHS_IT = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const DAYS_IT = [
  "DOMENICA",
  "LUNEDÌ",
  "MARTEDÌ",
  "MERCOLEDÌ",
  "GIOVEDÌ",
  "VENERDÌ",
  "SABATO",
];

// ===== FUNZIONI PRINCIPALI =====

/**
 * Inizializza l'applicazione
 */
function initApp() {
  setupEventListeners();
  setupThemeSelector();
}

/**
 * Configura tutti gli event listener
 */
function setupEventListeners() {
  const loadButton = document.getElementById("bottone-carica-pdf");
  const fileInput = document.getElementById("file-pdf");
  const printButton = document.getElementById("bottone-stampa");

  if (loadButton && fileInput) {
    loadButton.addEventListener("click", handlePdfLoad);
  }

  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }
}

/**
 * Gestisce il caricamento e parsing del PDF
 */
async function handlePdfLoad() {
  const fileInput = document.getElementById("file-pdf");
  const loadButton = document.getElementById("bottone-carica-pdf");

  const files = fileInput.files;
  if (!files || files.length === 0) {
    alert("Seleziona un file PDF prima di caricare");
    return;
  }

  const file = files[0];
  setLoadingState(loadButton, true);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const rawText = await extractTextFromPdf(arrayBuffer);
    const schedule = parseSchedule(rawText);
    populateTable(schedule);
  } catch (error) {
    console.error("Errore durante il caricamento del PDF:", error);
    alert("Errore durante la lettura del PDF: " + (error?.message || error));
  } finally {
    setLoadingState(loadButton, false);
  }
}

/**
 * Carica pdf.js dinamicamente dal CDN
 */
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);

    const script = document.createElement("script");
    script.src = PDF_CDN_URL;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib non disponibile dopo il caricamento"));
      }
    };
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
}

/**
 * Estrae il testo da un PDF usando pdf.js
 */
async function extractTextFromPdf(arrayBuffer) {
  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const maxPages = pdf.numPages;
  const pageTexts = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n");
}

/**
 * Effettua il parsing del testo estratto dal PDF per creare lo schedule
 */
function parseSchedule(rawInput) {
  const schedule = [];

  // Trova tutte le date nel formato dd/mm/yyyy che NON sono timestamp
  const datePattern = /(\d{2}\/\d{2}\/\d{4})(?!\s*,\s*\d{2}:\d{2}:\d{2})/g;
  const matches = [];
  let match;

  while ((match = datePattern.exec(rawInput)) !== null) {
    matches.push({
      date: match[1],
      index: match.index,
    });
  }

  // Per ogni data trovata, estrae la sezione corrispondente
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];

    const startIndex = currentMatch.index;
    const endIndex = nextMatch ? nextMatch.index : rawInput.length;
    const section = rawInput.substring(startIndex, endIndex);

    const [day, month, year] = currentMatch.date.split("/").map(Number);
    const entry = createScheduleEntry(currentMatch.date, month, year, section);

    schedule.push(entry);
  }

  return schedule;
}

/**
 * Popola la tabella con i dati dello schedule
 */
function populateTable(schedule) {
  const tbody = document.querySelector("#myTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const displayName = buildDisplayNameMap(schedule);

  schedule.forEach((entry) => {
    const row = createTableRow(entry, displayName);
    tbody.appendChild(row);
  });

  updateMonthHeader(schedule);
}

// ===== FUNZIONI AUSILIARIE =====

/**
 * Crea un oggetto entry dello schedule
 */
function createScheduleEntry(date, month, year, section) {
  const entry = {
    date,
    month,
    year,
    event: "",
    roles: {
      audio: null,
      microfonista: null,
      usciereIngresso: null,
      video: null,
      uscierAuditorium: null,
    },
  };

  // Cerca "Adunanza" nel testo di questa sezione
  const adunanzaMatch = section.match(/Adunanza[^0-9]*?(?=\s*[A-Z][a-z]+,)/);
  if (adunanzaMatch) {
    entry.event = adunanzaMatch[0].trim();
  }

  // Estrae i ruoli usando regex specifiche
  const roleRegexes = {
    audio: /([A-Za-z]+,\s*[A-Za-z\s\.L]+?)\s*\(Audio\)/gi,
    video: /([A-Za-z]+,\s*[A-Za-z\s\.L]+?)\s*\(Video\)/gi,
    microfonista: /([A-Za-z]+,\s*[A-Za-z\s\.L]+?)\s*\(Microfonista\)/gi,
    usciereIngresso: /([A-Za-z]+,\s*[A-Za-z\s\.L]+?)\s*\(Usciere ingresso\)/gi,
    uscierAuditorium:
      /([A-Za-z]+,\s*[A-Za-z\s\.L]+?)\s*\(Usciere auditorium\)/gi,
  };

  Object.entries(roleRegexes).forEach(([property, regex]) => {
    const match = regex.exec(section);
    if (match) {
      const name = match[1].trim();
      entry.roles[property] = name;
    }
  });

  return entry;
}

/**
 * Crea una riga della tabella per un entry dello schedule
 */
function createTableRow(entry, displayNameFunction) {
  const row = document.createElement("tr");

  // Colonna DATA
  const dateCell = document.createElement("td");
  dateCell.className = "data";
  if (entry.date) {
    const [day, month, year] = entry.date.split("/").map(Number);
    dateCell.textContent = formatWeekday(day, month, year);
  } else {
    dateCell.textContent = "-";
  }

  // Colonna AUDIO / VIDEO
  const audioVideoCell = document.createElement("td");
  const audioText = entry.roles.audio
    ? displayNameFunction(entry.roles.audio)
    : "";
  const videoText = entry.roles.video
    ? displayNameFunction(entry.roles.video)
    : "";
  const combinedAV = [audioText, videoText].filter(Boolean).join(" - ");
  audioVideoCell.textContent = combinedAV || "-";

  // Colonna MICROFONISTA
  const microCell = document.createElement("td");
  microCell.className = "addetto-microfonista";
  const microText = entry.roles.microfonista
    ? displayNameFunction(entry.roles.microfonista)
    : "";
  microCell.textContent = microText || "-";

  // Colonna USCIERI
  const uscieriCell = document.createElement("td");
  const ingresso = entry.roles.usciereIngresso
    ? displayNameFunction(entry.roles.usciereIngresso)
    : "";
  const auditorium = entry.roles.uscierAuditorium
    ? displayNameFunction(entry.roles.uscierAuditorium)
    : "";
  const combinedUscieri = [ingresso, auditorium].filter(Boolean).join(" - ");
  uscieriCell.textContent = combinedUscieri || "-";

  row.appendChild(dateCell);
  row.appendChild(audioVideoCell);
  row.appendChild(microCell);
  row.appendChild(uscieriCell);

  return row;
}

/**
 * Costruisce una mappa nomeCompleto -> formato COGNOME N.
 */
function buildDisplayNameMap(schedule) {
  const displayMap = new Map();

  schedule.forEach((entry) => {
    Object.values(entry.roles).forEach((name) => {
      if (!name) return;
      const parsed = parseName(name);
      const firstInitial = parsed.firstGivenName
        ? parsed.firstGivenName[0].toUpperCase()
        : "";
      const display = `${parsed.surname.toUpperCase()} ${firstInitial}.`;
      displayMap.set(name, display);
    });
  });

  return (name) => displayMap.get(name) || name.toUpperCase();
}

/**
 * Configura il selettore dei temi
 */
function setupThemeSelector() {
  const themeSelector = document.getElementById("tema-selector");
  if (!themeSelector) return;

  themeSelector.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    applyTheme(selectedTheme);
  });
}

/**
 * Applica il tema selezionato
 */
function applyTheme(theme) {
  document.body.classList.remove("tema-moderno", "tema-material");

  if (theme === "moderno") {
    document.body.classList.add("tema-moderno");
  } else if (theme === "material") {
    document.body.classList.add("tema-material");
  }
}

/**
 * Aggiorna l'intestazione del mese
 */
function updateMonthHeader(schedule) {
  if (schedule.length === 0) return;

  const firstEntry = schedule[0];
  const monthElement = document.getElementById("mese-programma");
  if (monthElement) {
    monthElement.textContent = `${getMonthName(firstEntry.month)} ${
      firstEntry.year
    }`;
  }
}

/**
 * Imposta lo stato di caricamento del pulsante
 */
function setLoadingState(button, isLoading) {
  if (!button) return;

  button.disabled = isLoading;
  button.textContent = isLoading ? "Caricamento..." : "Carica";
}

// ===== FUNZIONI UTILITY =====

/**
 * Effettua il parsing di un nome nel formato "Cognome, Nome Altri"
 */
function parseName(rawName) {
  const original = rawName.trim();
  let surname = original;
  let givenName = "";

  if (original.includes(",")) {
    const parts = original.split(",");
    surname = parts[0].trim();
    givenName = parts.slice(1).join(",").trim();
  } else {
    // Fallback: ultimo token come cognome
    const tokens = original.split(/\s+/);
    surname = tokens.pop();
    givenName = tokens.join(" ");
  }

  const givenParts = givenName.split(/\s+/).filter(Boolean);

  return {
    original,
    surname,
    firstGivenName: givenParts[0] || "",
    otherGivenParts: givenParts.slice(1),
  };
}

/**
 * Restituisce il nome del mese in italiano
 */
function getMonthName(monthNumber) {
  return MONTHS_IT[(monthNumber - 1) % 12] || "";
}

/**
 * Formatta la data come "GIORNO_SETTIMANA NUMERO" (es. "GIOVEDÌ 4")
 */
function formatWeekday(day, month, year) {
  const date = new Date(year, month - 1, day); // month è 0-based in JS
  const weekdayIndex = date.getDay();
  return `${DAYS_IT[weekdayIndex]} ${date.getDate()}`;
}

// ===== INIZIALIZZAZIONE =====

document.addEventListener("DOMContentLoaded", initApp);
