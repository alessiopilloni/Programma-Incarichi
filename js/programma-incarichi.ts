const elencoUScieri: string[] = [];
const elencoMicrofonisti: string[] = [];
const elencoAudioVideo: string[] = [];

// Interface for a Person object
interface Person {
  nomeUsciere?: string;
  nomeMicrofonista?: string;
  nomeAudioVideo?: string;
}

function caricaFileCSV(): void {
  // Type casting with nullish coalescing operator for safer handling
  const fileButtonInput =
    (document.getElementById("file-csv") as HTMLInputElement) ?? null;

  if (!fileButtonInput || !fileButtonInput.files?.length) {
    return; // Error: No file selected
  }

  const file: File = fileButtonInput.files[0];

  const reader = new FileReader();

  reader.onload = function (event: ProgressEvent<FileReader>) {
    if (!event.target || !event.target.result) {
      return; // Handle potential errors during reading
    }

    const csvData = event.target.result as string;

    const rows = csvData.split("\n");

    // Skip the first row (headers)
    rows.shift();

    const elencoUScieri: string[] = [];
    const elencoMicrofonisti: string[] = [];
    const elencoAudioVideo: string[] = [];

    // Process each row of the CSV file
    for (const row of rows) {
      const columns = row.split(",");

      // Create a Person object using ES2018 object spreads and optional chaining
      const person: Person = {
        nomeUsciere: columns[0] ?? "",
        nomeMicrofonista: columns[1] ?? "",
        nomeAudioVideo: columns[2] ?? "",
      };

      // Add the person object to the appropriate array(s) based on their roles
      if (person.nomeUsciere) {
        elencoUScieri.push(person.nomeUsciere);
      }
      if (person.nomeMicrofonista) {
        elencoMicrofonisti.push(person.nomeMicrofonista);
      }
      if (person.nomeAudioVideo) {
        elencoAudioVideo.push(person.nomeAudioVideo);
      }
    }

    popolaIncarichi(); // Call popolaIncarichi with individual arrays
  };

  reader.readAsText(file);
}

const divMeseProgramma = document.getElementById(
  "mese-programma"
) as HTMLDivElement;
let dataCorrente = new Date();
// Aumentare la data corrente di un mese, così all'apertura è già al mese successivo a quello odierno
dataCorrente.setMonth(dataCorrente.getMonth() + 1);
dataCorrente = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), 1);
// Array dei nomi dei mesi
let nomiMesi = [
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
let meseSuccessivo: string = nomiMesi[dataCorrente.getMonth()];
let annoSuccessivo: number = dataCorrente.getFullYear();
const annoElementoHTML = document.getElementById("anno") as HTMLInputElement;
annoElementoHTML.value = annoSuccessivo.toString();
const selectMese = document.getElementById("select-mese") as HTMLSelectElement;

// Cicla attraverso le option della select
for (let i = 0; i < selectMese.options.length; i++) {
  // Controlla se il value dell'opzione corrente è uguale a meseSuccessivo
  if (parseInt(selectMese.options[i].value) === dataCorrente.getMonth()) {
    // Imposta l'attributo "selected" alla option corrente
    selectMese.options[i].setAttribute("selected", "selected");
  } else {
    // Rimuovi l'attributo "selected" dalle option diverse da quella corrente
    selectMese.options[i].removeAttribute("selected");
  }
} // Aggiungere il valore dinamicamente al div
divMeseProgramma.textContent = `${meseSuccessivo} ${annoSuccessivo}`;

const table = document.getElementById("myTable") as HTMLTableElement;
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
const rows = tbody.querySelectorAll("tr");
const selectData = document.getElementById("select-data") as HTMLSelectElement;

const selectRow = document.getElementById("select-row") as HTMLSelectElement;

const selectRowChanging = document.getElementById(
  "select-row-changing"
) as HTMLSelectElement;

function hideRow() {
  const lastOptionData = selectData.lastElementChild as HTMLOptionElement;
  const lastOptionRow = selectRow.lastElementChild as HTMLOptionElement;
  const lastOptionChanging =
    selectRowChanging.lastElementChild as HTMLOptionElement;
  let rowCount = table.rows.length;

  // Nascondi l'ultima riga le option data del div di modifica
  table.rows[rowCount - 1].style.display = "none";
  lastOptionData.style.display = "none";
  lastOptionRow.style.display = "none";
  lastOptionChanging.style.display = "none";
  const ultimaCellaData = celleData[celleData.length - 1];

  ultimaCellaData.textContent = "DATA";
  lastOptionData.textContent = "DATA";
  lastOptionRow.textContent = "DATA";
  lastOptionChanging.textContent = "DATA";
}

function showRow() {
  let rowCount = table.rows.length;

  // Mostra l'ultima riga
  table.rows[rowCount - 1].style.display = "table-row";
}

// Popolare le date in tabella
const celleData = document.querySelectorAll(".data"); //Salva tutte le celle con campo data
let giornoPrimaAdunanzaDelMese = 1; // Inizializza a 1 o a qualsiasi giorno sia il primo giorno di adunanza del mese
let giornoSettimanaCorrente = 1;
function populateDateCell() {
  const meseCorrente = dataCorrente.getMonth() + 1;
  giornoSettimanaCorrente = dataCorrente.getDay();

  // Cerca quale se c'è prima Domenica o Giovedì e che giorno è
  function PrimaGiooDom() {
    giornoPrimaAdunanzaDelMese = 1;
    while (giornoSettimanaCorrente !== 0 && giornoSettimanaCorrente !== 4) {
      giornoSettimanaCorrente++;
      giornoPrimaAdunanzaDelMese++;
      if (giornoSettimanaCorrente > 6) {
        giornoSettimanaCorrente = 0; // Torniamo a Domenica se siamo arrivati alla fine della settimana
      }
    }
    return giornoSettimanaCorrente;
  }

  const primoGiornoAdunanza = PrimaGiooDom();
  const giorno1 = primoGiornoAdunanza === 4 ? "GIOVEDÌ" : "DOMENICA";
  const giorno2 = primoGiornoAdunanza === 0 ? "GIOVEDÌ" : "DOMENICA";
  let giornoAdunanza = giornoPrimaAdunanzaDelMese;
  for (let i = 0; i < celleData.length; i += 2) {
    celleData[i].textContent = `${giorno1}${giornoAdunanza}/${meseCorrente}`;
    giornoAdunanza += 7;
  }
  if (giorno1 === "GIOVEDÌ") {
    giornoAdunanza = giornoPrimaAdunanzaDelMese + 3;
  } else {
    giornoAdunanza = giornoPrimaAdunanzaDelMese + 4;
  }

  for (let i = 1; i < celleData.length; i += 2) {
    celleData[i].textContent = `${giorno2}${giornoAdunanza}/${meseCorrente}`;
    giornoAdunanza += 7;
  }
}

populateDateCell();

let ultimoGiorno: number = 1;
function ultimoGiornoDelMese(data: Date): number {
  // Ottieni il mese successivo
  let meseSuccessivo = new Date(data.getFullYear(), data.getMonth() + 1, 1);
  // Sottrai un giorno dalla data successiva per ottenere l'ultimo giorno del mese corrente
  const dataUltimoGiorno = new Date(
    meseSuccessivo.getFullYear(),
    meseSuccessivo.getMonth(),
    0
  );
  ultimoGiorno = dataUltimoGiorno.getDate();
  return ultimoGiorno;
}

// Utilizzo:
ultimoGiorno = ultimoGiornoDelMese(dataCorrente);
ultimoGiorno = ultimoGiornoDelMese(dataCorrente);
if (giornoPrimaAdunanzaDelMese + 28 > ultimoGiorno) {
  hideRow();
} else {
  showRow();
}

function contaElementi() {
  let conteggio: Record<string, number> = {};

  rows.forEach(function (row) {
    const cells = row.querySelectorAll(
      "td:not(.data)"
    ) as NodeListOf<HTMLTableCellElement>;
    cells.forEach(function (cell) {
      if (cell.textContent) {
        let elementi = cell.textContent.split(" - ");
        elementi.forEach(function (elemento) {
          elemento = elemento.trim();
          if (elemento in conteggio) {
            conteggio[elemento]++;
          } else {
            conteggio[elemento] = 1;
          }
        });
      }
    });
  });

  let contatoreDiv = document.getElementById(
    "contatore-incarichi"
  ) as HTMLDivElement;
  let testoContatoreIncarichi =
    "<strong>Sono stati impiegati i seguenti fratelli:</strong>";
  for (let elemento in conteggio) {
    if (conteggio[elemento] === 1) {
      testoContatoreIncarichi +=
        elemento + " " + conteggio[elemento] + " volta | ";
    } else {
      testoContatoreIncarichi +=
        elemento + " " + conteggio[elemento] + " volte | ";
    }
  }
  if (testoContatoreIncarichi.length === 70) {
    contatoreDiv.innerHTML =
      "Carica prima il file CSV o completa la tabella manualmente";
  } else {
    testoContatoreIncarichi = testoContatoreIncarichi.slice(0, -3);
    contatoreDiv.innerHTML = testoContatoreIncarichi;
  }
}
// Funzione per mescolare l'array così che siano in ordine casuale
function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Funzione  che verifica che tutti gli addetti siano impiegati
function ciSonoElementiInutilizzati() {
  var rows = tbody.querySelectorAll("tr") as NodeListOf<HTMLTableRowElement>;
  let conteggio: Record<string, number> = {};

  rows.forEach(function (row) {
    const cells = row.querySelectorAll(
      "td:not(.data)"
    ) as NodeListOf<HTMLTableCellElement>;
    cells.forEach(function (cell) {
      if (cell.textContent) {
        let elementi = cell.textContent.split(" - ");
        elementi.forEach(function (elemento) {
          elemento = elemento.trim();
          if (elemento in conteggio) {
            conteggio[elemento]++;
          } else {
            conteggio[elemento] = 1;
          }
        });
      }
    });
  });

  // Confronto con gli array
  var elencoCompleto = [
    ...elencoUScieri,
    ...elencoMicrofonisti,
    ...elencoAudioVideo,
  ];
  var elementiInutilizzati = elencoCompleto.filter(function (elemento) {
    return !(elemento in conteggio);
  });
  const stringaPrimoElementoInutilizzato = elementiInutilizzati[0];
  return stringaPrimoElementoInutilizzato; // Se tutto ok, sarà vuoto, o meglio undefined
}

function sonoTuttiDiversi(...args: (string | undefined)[]): boolean {
  const visti: Record<string, boolean> = {}; // Oggetto per memorizzare gli elementi visti

  // Controllo di tutti gli elementi
  for (const arg of args) {
    if (arg === undefined) {
      continue; // Ignora gli elementi "undefined"
    }

    // Se l'elemento è già stato visto, ritorna falso
    if (visti[arg]) {
      return false;
    }

    // Segna l'elemento come visto
    visti[arg] = true;
  }

  // Se tutti gli elementi sono stati visti una sola volta, ritorna true
  return true;
}

let contaTentativi = 0;
// Funzione per popolare una riga della tabella
function popolateRow(row: HTMLTableRowElement) {
  let elencoAudioVideoCopy = shuffleArray([...elencoAudioVideo]);
  let elencoMicrofonistiCopy = shuffleArray([...elencoMicrofonisti]);
  let elencoUScieriCopy = shuffleArray([...elencoUScieri]);

  const audioVideoCell = row.querySelector(".addetti-audio-video") as HTMLTableCellElement;
  const microfonistaCell = row.querySelector(".addetto-microfonista") as HTMLTableCellElement;
  const uscieriCell = row.querySelector(".addetti-uscieri") as HTMLTableCellElement;

  let operatoreAudioVideo1 = elencoAudioVideoCopy.pop();
  let operatoreAudioVideo2 = elencoAudioVideoCopy.pop();
  let microfonista = elencoMicrofonistiCopy.pop();
  let usciere1 = elencoUScieriCopy.pop();
  let usciere2 = elencoUScieriCopy.pop();

  // Se ci sono duplicati, rigenera la riga
  while (
    !sonoTuttiDiversi(
      operatoreAudioVideo1,
      operatoreAudioVideo2,
      microfonista,
      usciere1,
      usciere2
    )
  ) {
    elencoAudioVideoCopy = shuffleArray([...elencoAudioVideo]);
    elencoMicrofonistiCopy = shuffleArray([...elencoMicrofonisti]);
    elencoUScieriCopy = shuffleArray([...elencoUScieri]);

    operatoreAudioVideo1 = elencoAudioVideoCopy.pop();
    operatoreAudioVideo2 = elencoAudioVideoCopy.pop();
    microfonista = elencoMicrofonistiCopy.pop();
    usciere1 = elencoUScieriCopy.pop();
    usciere2 = elencoUScieriCopy.pop();
  }

  audioVideoCell.textContent = `${operatoreAudioVideo1} - ${operatoreAudioVideo2}`;
  microfonistaCell.textContent = `${microfonista}`;
  uscieriCell.textContent = `${usciere1} - ${usciere2}`;
  // contaElementi();
}

// Funzione per popolare tutti gli incarichi
function popolaIncarichi() {
  let tentativi = 0;

  while (true) {
    rows.forEach(popolateRow);

    const conteggioElementi: Record<string, number> = {};

    // Conteggio degli elementi nelle celle non di data
    rows.forEach((row) => {
      const celleNonData = row.querySelectorAll("td:not(.data)") as NodeListOf<HTMLTableCellElement>;
      celleNonData.forEach((cella) => {
        if (cella.textContent){
        const contenuto = cella.textContent.trim();
        const elementi = contenuto.split(" - ");
        elementi.forEach((elemento) => {
          conteggioElementi[elemento] = (conteggioElementi[elemento] || 0) + 1;
        });
      }
      });
    });

    // Verifica se c'è almeno un elemento con più di 3 occorrenze e tutti gli
    // incaricati sono stati inseriti almeno una volta
    let almenoUnElementoSuperioreAMax = false;

for (const count of Object.keys(conteggioElementi)) {
  if (conteggioElementi[count] > 3) {
    almenoUnElementoSuperioreAMax = true;
    break;
  }
}

if (!almenoUnElementoSuperioreAMax && !ciSonoElementiInutilizzati()) {
  contaElementi();
  console.log(tentativi);
  break;
}


    tentativi++;
  }
}

//MODIFICHE MANUALI
// Scelta manuale del mese
const aggiornaDataButton = document.getElementById("aggiorna-data") as HTMLButtonElement
aggiornaDataButton.addEventListener("click", function () {
  let meseSelezionato = parseInt(selectMese.value);
  let annoSelezionato = parseInt(annoElementoHTML.value);
  // Verifica se il mese è valido (da 0 a 11) e l'anno è un numero
  if (
    !isNaN(meseSelezionato) &&
    meseSelezionato >= 0 &&
    meseSelezionato <= 11 &&
    !isNaN(annoSelezionato) &&
    annoSelezionato >= 2024 &&
    annoSelezionato <= 2100
  ) {
    dataCorrente = new Date(annoSelezionato, meseSelezionato, 1);
    // Aggiorna il valore nel div
    divMeseProgramma.textContent = `${nomiMesi[meseSelezionato]} ${annoSelezionato}`;
    populateDateCell();
    ultimoGiorno = ultimoGiornoDelMese(dataCorrente);
    ultimoGiorno = ultimoGiornoDelMese(dataCorrente);
    popolaOptionDate();
    //se l'ultima riga è una data non valida (ex 32 Dicembre) nascondi riga
    if (giornoPrimaAdunanzaDelMese + 28 > ultimoGiorno) {
      hideRow();
    } else {
      //altrimenti mostra ultima riga
      showRow();
    }
  } else {
    alert("Inserisci un mese e un anno validi.");
  }
});

// Cicla le celle e aggiunge i valori come opzioni
function popolaOptionDate() {
  selectData.innerHTML = "";
  selectRow.innerHTML = "";
  selectRowChanging.innerHTML = "";
  celleData.forEach(function (cell, index) {
    if(cell.textContent){
    let valore = cell.textContent.trim();

    // Creare due opzioni separate per ciascun select
    let option1 = document.createElement("option") as HTMLOptionElement;
    option1.value = index.toString();
    option1.textContent = valore;

    let option2 = document.createElement("option") as HTMLOptionElement;
    option2.value = index.toString();
    option2.textContent = valore;

    let option3 = document.createElement("option") as HTMLOptionElement;
    option3.value = index.toString();
    option3.textContent = valore;

    selectData.appendChild(option1);
    selectRow.appendChild(option2);
    selectRowChanging.appendChild(option3);
  }
  });
}
popolaOptionDate();

function cambiaData() {
  // Modifica la data di una riga
  // Ottieni la cella selezionata
  let indiceCellaSelezionata = parseInt(selectData.value);
  let celle = document.querySelectorAll(".data") as NodeListOf<HTMLTableCellElement>;
  let cellaSelezionata = celle[indiceCellaSelezionata];
  let pattern =
    /^(DOMENICA|LUNEDÌ|MARTEDÌ|MERCOLEDÌ|GIOVEDÌ|VENERDÌ|SABATO)\s\d+\/\d+$/;
  // Ottieni il testo da iniettare
  const cambiaDataButton = document.getElementById("cambiaData") as HTMLButtonElement
  let testoDaIniettare = 
    cambiaDataButton.value.toUpperCase();

  // Inietta il testo nella cella selezionata
  if (pattern.test(testoDaIniettare)) {
    cellaSelezionata.textContent = testoDaIniettare;
    popolaOptionDate();
  } else {
    alert("Inserisci una data valida");
  }
  cambiaDataButton.value = "";
}
const modificaRigaButton = document.getElementById("modifica-riga") as HTMLInputElement
function modificaRiga() {
  // Per inserire del testo al posto dei nominativi
  // Ottieni il valore selezionato dalla option
  let selectedIndex = parseInt(selectRow.value);

  // Trova la riga corrispondente
  const row = celleData[selectedIndex].parentNode as HTMLTableRowElement;

  // Modifica le celle della riga
  const cells = row.querySelectorAll("td");
  cells.forEach(function (cell) {
    if (cell.classList.contains("addetto-microfonista")) {
      // Trasforma la cella con classe .addetti-audio-video in colspan 5
      cell.colSpan = 5;
      // Inserisci il testo dall'input modifica-riga
      let inputValue = modificaRigaButton.value;
      cell.textContent = inputValue;
    } else if (!cell.classList.contains("data")) {
      // Nascondi tutte le altre celle della riga
      cell.style.display = "none";
    }
  });
  modificaRigaButton.value = "";
}
function ripristinaRiga() {
  let selectedIndex = parseInt(selectRow.value);
  // Trova la riga corrispondente
  let row = celleData[selectedIndex].parentNode as HTMLTableRowElement;

  // Modifica le celle della riga
  const cells = row.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>;
  cells.forEach(function (cell) {
    cell.style.display = "table-cell";
    if (cell.classList.contains("addetti-audio-video")) {
      // Trasforma la cella con classe .addetti-audio-video in colspan 2
      cell.colSpan = 2;
    }
    if (cell.classList.contains("addetto-microfonista")) {
      cell.colSpan = 1;
    }
  });
  popolateRow(row);
}
function aggiornaRiga() {
  let selectedIndex = parseInt(selectRowChanging.value);
  // Trova la riga corrispondente
  let row = celleData[selectedIndex].parentNode as HTMLTableRowElement;

  popolateRow(row);
}

function showOptions() {
  const showHideButton = document.getElementById("show-hide-last-row") as HTMLButtonElement;
  const lastOptionData = selectData.lastElementChild as HTMLOptionElement;;
  const lastOptionRow = selectRow.lastElementChild as HTMLOptionElement;;
  const lastOptionChanging = selectRowChanging.lastElementChild as HTMLOptionElement;
  if (giornoPrimaAdunanzaDelMese + 28 <= ultimoGiorno) {
    alert(
      "Non è possibile nascondere o mostrare l'ultima riga di un giorno di adunanza valido"
    );
  } else if (showHideButton.innerText === "Nascondi ultima riga") {
    hideRow();
    showHideButton.textContent = "Mostra ultima riga nascosta";
  } else {
    showRow();
    lastOptionData.style.display = "block";
    lastOptionRow.style.display = "block";
    lastOptionChanging.style.display = "block";

    showHideButton.textContent = "Nascondi ultima riga";
  }
}

function ripristinaDataRiga() {
  populateDateCell();
  popolaOptionDate();
}

//funzione per cambiare anno dell'input con la rotella del mouse
annoElementoHTML.addEventListener("wheel", (event: WheelEvent) => {
  const input = event.target as HTMLInputElement | null;

  if (input && typeof input.value === "string") { 
    const newValue = parseInt(input.value) + (event.deltaY > 0 ? -1 : 1);
    const min = parseInt(input.min || "0"); 
    const max = parseInt(input.max || "100"); 

    if (newValue >= min && newValue <= max) {
      input.value = newValue.toString(); 
    }
  }

  event.preventDefault(); // Non fa scorrere la pagina
});
