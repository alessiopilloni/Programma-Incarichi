const elencoUScieri = [];
const elencoMicrofonisti = [];
const elencoAudioVideo = [];

function caricaFileCSV() {
  const file = document.getElementById("file-csv").files[0];

  if (!file) {
    return; // Errore: nessun file selezionato
  }

  const reader = new FileReader();

  reader.onload = function () {
    const csvData = reader.result;

    const rows = csvData.split("\n");

    //Salta la prima riga (intestazioni)
    rows.shift();

    // Per ogni riga del file CSV...
    for (const row of rows) {
      const columns = row.split(",");

      // Estrai i dati per ogni colonna
      const nomeUsciere = columns[0];
      const nomeMicrofonista = columns[1];
      const nomeAudioVideo = columns[2];

      // Aggiungi i dati agli array
      if (nomeUsciere) {
        elencoUScieri.push(nomeUsciere);
      }
      if (nomeMicrofonista) {
        elencoMicrofonisti.push(nomeMicrofonista);
      }
      if (nomeAudioVideo) {
        elencoAudioVideo.push(nomeAudioVideo);
      }
    }

    popolaIncarichi(); //popola con i dati del CSV
  };

  reader.readAsText(file);
}

const divMeseProgramma = document.getElementById("mese-programma");
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
let meseSuccessivo = nomiMesi[dataCorrente.getMonth()];
let annoSuccessivo = dataCorrente.getFullYear();
document.getElementById("anno").value = annoSuccessivo;
const selectMese = document.getElementById("select-mese");

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

const table = document.getElementById("myTable");
const tbody = document.querySelector("tbody");
const rows = tbody.querySelectorAll("tr");
const selectData = document.getElementById("select-data");

const selectRow = document.getElementById("select-row");

const selectRowChanging = document.getElementById("select-row-changing");

function hideRow() {
  const lastOptionData = selectData.lastElementChild;
  const lastOptionRow = selectRow.lastElementChild;
  const lastOptionChanging = selectRowChanging.lastElementChild;
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
  const table = document.getElementById("myTable");
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
    celleData[i].textContent = `${giorno1.padEnd(
      9
    )}${giornoAdunanza}/${meseCorrente}`;
    giornoAdunanza += 7;
  }
  if (giorno1 === "GIOVEDÌ") {
    giornoAdunanza = giornoPrimaAdunanzaDelMese + 3;
  } else {
    giornoAdunanza = giornoPrimaAdunanzaDelMese + 4;
  }

  for (let i = 1; i < celleData.length; i += 2) {
    celleData[i].textContent = `${giorno2.padEnd(
      9
    )}${giornoAdunanza}/${meseCorrente}`;
    giornoAdunanza += 7;
  }
}

populateDateCell();

let ultimoGiorno = "";
function ultimoGiornoDelMese(data) {
  // Ottieni il mese successivo
  let meseSuccessivo = new Date(data.getFullYear(), data.getMonth() + 1, 1);
  // Sottrai un giorno dalla data successiva per ottenere l'ultimo giorno del mese corrente
  ultimoGiorno = new Date(meseSuccessivo - 1);
  return ultimoGiorno.getDate();
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
  var conteggio = {};

  rows.forEach(function (row) {
    var cells = row.querySelectorAll("td:not(.data)");
    cells.forEach(function (cell) {
      var elementi = cell.textContent.split(" - ");
      elementi.forEach(function (elemento) {
        elemento = elemento.trim();
        if (elemento in conteggio) {
          conteggio[elemento]++;
        } else {
          conteggio[elemento] = 1;
        }
      });
    });
  });

  var contatoreDiv = document.getElementById("contatore-incarichi");
  testoContatoreIncarichi =
    "<strong>Sono stati impiegati i seguenti fratelli:</strong>";
  for (var elemento in conteggio) {
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
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Funzione  che verifica che tutti gli addetti siano impiegati
function ciSonoElementiInutilizzati() {
  var tbody = document.querySelector("tbody");
  var rows = tbody.querySelectorAll("tr");
  var conteggio = {};

  rows.forEach(function (row) {
    var cells = row.querySelectorAll("td:not(.data)");
    cells.forEach(function (cell) {
      var elementi = cell.textContent.split(" - ");
      elementi.forEach(function (elemento) {
        elemento = elemento.trim();
        if (elemento in conteggio) {
          conteggio[elemento]++;
        } else {
          conteggio[elemento] = 1;
        }
      });
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

// Funzione per verificare se tutti gli elementi in riga siano diversi tra loro
function sonoTuttiDiversi(...args) {
  const uniqueSet = new Set(args);
  return uniqueSet.size === args.length;
}

let contaTentativi = 0;
// Funzione per popolare una riga della tabella
function popolateRow(row) {
  let elencoAudioVideoCopy = shuffleArray([...elencoAudioVideo]);
  let elencoMicrofonistiCopy = shuffleArray([...elencoMicrofonisti]);
  let elencoUScieriCopy = shuffleArray([...elencoUScieri]);

  const audioVideoCell = row.querySelector(".addetti-audio-video");
  const microfonistaCell = row.querySelector(".addetto-microfonista");
  const uscieriCell = row.querySelector(".addetti-uscieri");

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
  microfonistaCell.textContent = microfonista;
  uscieriCell.textContent = `${usciere1} - ${usciere2}`;
  // contaElementi();
}

// Funzione per popolare tutti gli incarichi
function popolaIncarichi() {
  let tentativi = 0;

  while (true) {
    rows.forEach(popolateRow);

    const conteggioElementi = {};

    // Conteggio degli elementi nelle celle non di data
    rows.forEach((row) => {
      const celleNonData = row.querySelectorAll("td:not(.data)");
      celleNonData.forEach((cella) => {
        const contenuto = cella.textContent.trim();
        const elementi = contenuto.split(" - ");
        elementi.forEach((elemento) => {
          conteggioElementi[elemento] = (conteggioElementi[elemento] || 0) + 1;
        });
      });
    });

    // Verifica se c'è almeno un elemento con più di 3 occorrenze e tutti gli
    // incaricati sono stati inseriti almeno una volta
    const almenoUnElementoSuperioreAMax = Object.values(conteggioElementi).some(
      (count) => count > 3
    );

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
document.getElementById("aggiorna-data").addEventListener("click", function () {
  let meseSelezionato = parseInt(document.getElementById("select-mese").value);
  let annoSelezionato = parseInt(document.getElementById("anno").value);
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
    let valore = cell.textContent.trim();

    // Creare due opzioni separate per ciascun select
    let option1 = document.createElement("option");
    option1.value = index;
    option1.textContent = valore;

    let option2 = document.createElement("option");
    option2.value = index;
    option2.textContent = valore;

    let option3 = document.createElement("option");
    option3.value = index;
    option3.textContent = valore;

    selectData.appendChild(option1);
    selectRow.appendChild(option2);
    selectRowChanging.appendChild(option3);
  });
}
popolaOptionDate();

function cambiaData() {
  // Modifica la data di una riga
  // Ottieni la cella selezionata
  let indiceCellaSelezionata = selectData.value;
  let celle = document.querySelectorAll(".data");
  let cellaSelezionata = celle[indiceCellaSelezionata];
  let pattern =
    /^(DOMENICA|LUNEDÌ|MARTEDÌ|MERCOLEDÌ|GIOVEDÌ|VENERDÌ|SABATO)\s\d+\/\d+$/;
  console.log(document.getElementById("cambiaData").value.toUpperCase());
  // Ottieni il testo da iniettare
  let testoDaIniettare = document
    .getElementById("cambiaData")
    .value.toUpperCase();

  // Inietta il testo nella cella selezionata
  if (pattern.test(testoDaIniettare)) {
    cellaSelezionata.textContent = testoDaIniettare;
    popolaOptionDate();
  } else {
    alert("Inserisci una data valida");
  }
  document.getElementById("cambiaData").value = "";
}

function modificaRiga() {
  // Per inserire del testo al posto dei nominativi
  // Ottieni il valore selezionato dalla option
  let selectedIndex = selectRow.value;

  // Trova la riga corrispondente
  let row = celleData[selectedIndex].parentNode;

  // Modifica le celle della riga
  const cells = row.querySelectorAll("td");
  cells.forEach(function (cell) {
    if (cell.classList.contains("addetto-microfonista")) {
      // Trasforma la cella con classe .addetti-audio-video in colspan 5
      cell.colSpan = 5;
      // Inserisci il testo dall'input modifica-riga
      let inputValue = document.getElementById("modifica-riga").value;
      cell.textContent = inputValue;
    } else if (!cell.classList.contains("data")) {
      // Nascondi tutte le altre celle della riga
      cell.style.display = "none";
    }
  });
  document.getElementById("modifica-riga").value = "";
}
function ripristinaRiga() {
  let selectedIndex = document.getElementById("select-row").value;
  // Trova la riga corrispondente
  let row = celleData[selectedIndex].parentNode;

  // Modifica le celle della riga
  const cells = row.querySelectorAll("td");
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
  let selectedIndex = selectRowChanging.value;
  // Trova la riga corrispondente
  let row = celleData[selectedIndex].parentNode;

  popolateRow(row);
}

function showOptions() {
  const showHideButton = document.getElementById("show-hide-last-row");
  const lastOptionData = selectData.lastElementChild;
  const lastOptionRow = selectRow.lastElementChild;
  const lastOptionChanging = selectRowChanging.lastElementChild;
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
document.getElementById("anno").addEventListener("wheel", function (event) {
  let input = event.target;
  let newValue = parseInt(input.value) + (event.deltaY > 0 ? -1 : 1);
  let min = parseInt(input.min);
  let max = parseInt(input.max);
  if (newValue >= min && newValue <= max) {
    input.value = newValue;
  }
  event.preventDefault(); // Non fa scorrere la pagina
});
