"use strict";
const elencoUScieri = [];
const elencoMicrofonisti = [];
const elencoAudioVideo = [];
const fileInput = document.getElementById("file-csv");
function caricaFileCSV() {
    const files = fileInput.files;
    if (!files || files.length === 0) {
        alert("Nessun file CSV selezionato");
        return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const csvData = String(reader.result || "");
        // Supporta CRLF o LF, rimuove righe vuote e spazi esterni
        const rows = csvData
            .split(/\r?\n/)
            .map(r => r.trim())
            .filter(r => r.length > 0);
        // Salta la prima riga (intestazioni) se presente
        if (rows.length > 0)
            rows.shift();
        // Per ogni riga del file CSV...
        for (const row of rows) {
            // parsing semplice: supporta campi quotati e rimuove virgolette esterne
            const columns = row
                .split(',')
                .map(c => c.trim().replace(/^"|"$/g, ''));
            // Estrai i dati per ogni colonna
            const nomeUsciere = columns[0] || undefined;
            const nomeMicrofonista = columns[1] || undefined;
            const nomeAudioVideo = columns[2] || undefined;
            // Aggiungi i dati agli array (evita stringhe vuote)
            if (nomeUsciere)
                elencoUScieri.push(nomeUsciere);
            if (nomeMicrofonista)
                elencoMicrofonisti.push(nomeMicrofonista);
            if (nomeAudioVideo)
                elencoAudioVideo.push(nomeAudioVideo);
        }
        popolaIncarichi(); // popola con i dati del CSV
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
const annoElementoHTML = document.getElementById("anno");
annoElementoHTML.value = annoSuccessivo.toString();
const selectMese = document.getElementById("select-mese");
// Cicla attraverso le option della select
for (let i = 0; i < selectMese.options.length; i++) {
    // Controlla se il value dell'opzione corrente è uguale a meseSuccessivo
    if (parseInt(selectMese.options[i].value) === dataCorrente.getMonth()) {
        // Imposta l'attributo "selected" alla option corrente
        selectMese.options[i].setAttribute("selected", "selected");
    }
    else {
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
    // Controlli di sicurezza per evitare errori null
    if (lastOptionData) {
        lastOptionData.style.display = "none";
        lastOptionData.textContent = "DATA";
    }
    if (lastOptionRow) {
        lastOptionRow.style.display = "none";
        lastOptionRow.textContent = "DATA";
    }
    if (lastOptionChanging) {
        lastOptionChanging.style.display = "none";
        lastOptionChanging.textContent = "DATA";
    }
    const ultimaCellaData = celleData[celleData.length - 1];
    ultimaCellaData.textContent = "DATA";
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
    // Offset per il primo giorno della seconda serie (se la prima adunanza è GIOVEDÌ la seconda è +3, altrimenti +4)
    const offsetSecondo = primoGiornoAdunanza === 4 ? 3 : 4;
    // Un solo ciclo: gli indici pari sono la prima serie, gli indici dispari la seconda.
    for (let i = 0; i < celleData.length; i++) {
        const serieIndex = Math.floor(i / 2);
        const isPrimaSerie = i % 2 === 0;
        const giornoNumero = giornoPrimaAdunanzaDelMese + (isPrimaSerie ? serieIndex * 7 : offsetSecondo + serieIndex * 7);
        const nomeGiorno = isPrimaSerie ? giorno1 : giorno2;
        celleData[i].textContent = `${nomeGiorno} ${giornoNumero}/${meseCorrente}`;
    }
}
populateDateCell();
let ultimoGiorno = 1;
function ultimoGiornoDelMese(data) {
    // Ottieni il mese successivo
    let meseSuccessivo = new Date(data.getFullYear(), data.getMonth() + 1, 1);
    // Sottrai un giorno dalla data successiva per ottenere l'ultimo giorno del mese corrente
    const dataUltimoGiorno = new Date(meseSuccessivo.getFullYear(), meseSuccessivo.getMonth(), 0);
    ultimoGiorno = dataUltimoGiorno.getDate();
    return ultimoGiorno;
}
// Utilizzo:
ultimoGiorno = ultimoGiornoDelMese(dataCorrente);
ultimoGiorno = ultimoGiornoDelMese(dataCorrente);
if (giornoPrimaAdunanzaDelMese + 28 > ultimoGiorno) {
    hideRow();
}
else {
    showRow();
}
function contaElementi() {
    const conteggio = contaAssegnazioni();
    let contatoreDiv = document.getElementById("contatore-incarichi");
    let testoContatoreIncarichi = "<strong>Sono stati impiegati i seguenti fratelli:</strong>";
    for (let elemento in conteggio) {
        if (conteggio[elemento] === 1) {
            testoContatoreIncarichi +=
                elemento + " " + conteggio[elemento] + " volta | ";
        }
        else {
            testoContatoreIncarichi +=
                elemento + " " + conteggio[elemento] + " volte | ";
        }
    }
    if (testoContatoreIncarichi.length === 70) {
        contatoreDiv.innerHTML =
            "Carica prima il file CSV o completa la tabella manualmente";
    }
    else {
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
// Funzione che verifica che tutti gli addetti siano impiegati
function ciSonoElementiInutilizzati() {
    const conteggio = contaAssegnazioni();
    // Confronto con gli array
    const elencoCompleto = [
        ...elencoUScieri,
        ...elencoMicrofonisti,
        ...elencoAudioVideo,
    ];
    const elementiInutilizzati = elencoCompleto.filter(elemento => !(elemento in conteggio));
    return elementiInutilizzati[0]; // Se tutto ok, sarà undefined
}
function sonoTuttiDiversi(...args) {
    const visti = {}; // Oggetto per memorizzare gli elementi visti
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
// Costanti per la generazione (più permissive)
const MAX_TENTATIVI_RIGA = 200; // aumentato
const MAX_TENTATIVI_GLOBALI = 1000; // aumentato
const MAX_OCCORRENZE_PERSONA = 3; // aumentato
// Funzione per popolare una riga della tabella
// Restituisce l'insieme dei nominativi assegnati nella riga precedente (usata per evitare ripetizioni consecutive)
function getPrevAssigned(index) {
    const result = new Set();
    if (index <= 0)
        return result;
    const prevRow = rows[index - 1];
    const celle = prevRow.querySelectorAll("td:not(.data)");
    celle.forEach(cell => {
        if (!cell.textContent)
            return;
        cell.textContent.split(" - ").map(s => s.trim()).filter(Boolean).forEach(name => result.add(name));
    });
    return result;
}
function popolateRow(row, prevAssigned) {
    const files = fileInput.files;
    if (!files || files.length === 0) {
        alert("Nessun file CSV selezionato");
        return false;
    }
    // Verifica che ci siano abbastanza persone per riempire una riga
    if (elencoAudioVideo.length < 2 || elencoMicrofonisti.length < 1 || elencoUScieri.length < 2) {
        console.warn("Non ci sono abbastanza persone negli elenchi per riempire una riga");
        return false;
    }
    const audioVideoCell = row.querySelector(".addetti-audio-video");
    const microfonistaCell = row.querySelector(".addetto-microfonista");
    const uscieriCell = row.querySelector(".addetti-uscieri");
    let tentativi = 0;
    while (tentativi < MAX_TENTATIVI_RIGA) {
        // Copie mescolate
        const elencoAudioVideoCopy = shuffleArray([...elencoAudioVideo]);
        const elencoMicrofonistiCopy = shuffleArray([...elencoMicrofonisti]);
        const elencoUScieriCopy = shuffleArray([...elencoUScieri]);
        // Filtra i candidati eliminando quelli presenti nella riga precedente
        const audioCandidates = elencoAudioVideoCopy.filter(x => x && !prevAssigned.has(x));
        const microCandidates = elencoMicrofonistiCopy.filter(x => x && !prevAssigned.has(x));
        const usciereCandidates = elencoUScieriCopy.filter(x => x && !prevAssigned.has(x));
        // Se non ci sono abbastanza candidati distinti, aborta tentativo (fallback sarà gestito a livello globale)
        if (audioCandidates.length < 2 || microCandidates.length < 1 || usciereCandidates.length < 2) {
            tentativi++;
            continue;
        }
        const operatoreAudioVideo1 = audioCandidates.pop();
        const operatoreAudioVideo2 = audioCandidates.pop();
        const microfonista = microCandidates.pop();
        const usciere1 = usciereCandidates.pop();
        const usciere2 = usciereCandidates.pop();
        // Verifica che tutti i ruoli siano diversi tra loro
        if (sonoTuttiDiversi(operatoreAudioVideo1, operatoreAudioVideo2, microfonista, usciere1, usciere2)) {
            audioVideoCell.textContent = `${operatoreAudioVideo1} - ${operatoreAudioVideo2}`;
            microfonistaCell.textContent = `${microfonista}`;
            uscieriCell.textContent = `${usciere1} - ${usciere2}`;
            return true;
        }
        tentativi++;
    }
    console.warn(`Impossibile trovare una combinazione valida per la riga dopo ${MAX_TENTATIVI_RIGA} tentativi`);
    return false;
}
// Funzione helper per contare le assegnazioni
function contaAssegnazioni() {
    const conteggio = {};
    rows.forEach((row) => {
        const celleNonData = row.querySelectorAll("td:not(.data)");
        celleNonData.forEach((cella) => {
            if (cella.textContent) {
                const contenuto = cella.textContent.trim();
                if (contenuto && contenuto !== '') {
                    const elementi = contenuto.split(" - ").map(el => el.trim()).filter(el => el.length > 0);
                    elementi.forEach((elemento) => {
                        conteggio[elemento] = (conteggio[elemento] || 0) + 1;
                    });
                }
            }
        });
    });
    return conteggio;
}
// Funzione per verificare se la distribuzione è equilibrata
function isDistribuzioneEquilibrata() {
    const conteggioElementi = contaAssegnazioni();
    // Verifica che nessuno abbia più del massimo consentito
    const almenoUnElementoSuperioreAMax = Object.values(conteggioElementi).some(count => count > MAX_OCCORRENZE_PERSONA);
    // Verifica se ci sono elementi inutilizzati
    const elementoInutilizzato = ciSonoElementiInutilizzati();
    // Calcola la percentuale di persone utilizzate
    const elencoCompleto = [...elencoUScieri, ...elencoMicrofonisti, ...elencoAudioVideo];
    const personeUtilizzate = Object.keys(conteggioElementi).length;
    const percentualeUtilizzo = elencoCompleto.length > 0 ? personeUtilizzate / elencoCompleto.length : 0;
    // Considera accettabile se il 100% delle persone è stato utilizzato
    const utilizzoSufficiente = percentualeUtilizzo >= 1.00 || !elementoInutilizzato;
    return !almenoUnElementoSuperioreAMax && utilizzoSufficiente;
}
// Funzione per popolare tutti gli incarichi
function popolaIncarichi() {
    const files = fileInput.files;
    if (!files || files.length === 0) {
        alert("Nessun file CSV selezionato");
        return;
    }
    // Verifica preliminare: abbastanza persone per tutti i ruoli?
    const totalePersoneNecessarie = rows.length * 5; // 5 persone per riga (2 audio/video + 1 microfonista + 2 uscieri)
    const totalePersoneDisponibili = elencoAudioVideo.length + elencoMicrofonisti.length + elencoUScieri.length;
    if (totalePersoneDisponibili < totalePersoneNecessarie / 2) {
        alert("Attenzione: Il numero di persone disponibili potrebbe essere insufficiente per una distribuzione equilibrata.");
    }
    let tentativiGlobali = 0;
    let successo = false;
    let migliorDistribuzione = null;
    let migliorPunteggio = -Infinity;
    while (tentativiGlobali < MAX_TENTATIVI_GLOBALI && !successo) {
        let tutteLeRigheCompletate = true;
        // Prova a popolare tutte le righe
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const prevAssigned = getPrevAssigned(i);
            if (!popolateRow(row, prevAssigned)) {
                tutteLeRigheCompletate = false;
                break;
            }
        }
        // Se tutte le righe sono state completate, verifica la distribuzione
        if (tutteLeRigheCompletate) {
            const conteggioElementi = contaAssegnazioni();
            const personeUtilizzate = Object.keys(conteggioElementi).length;
            const maxOccorrenze = Object.values(conteggioElementi).length ? Math.max(...Object.values(conteggioElementi)) : 0;
            // Se la distribuzione è equilibrata bene, altrimenti valuta e salva come possibile fallback
            if (isDistribuzioneEquilibrata()) {
                successo = true;
                contaElementi();
                console.log(`Generazione completata con successo dopo ${tentativiGlobali + 1} tentativi`);
                break;
            }
            else {
                // Punteggio semplice: più persone usate e meno occorrenze massime => migliore
                const punteggio = personeUtilizzate - maxOccorrenze;
                if (punteggio > migliorPunteggio) {
                    migliorPunteggio = punteggio;
                    migliorDistribuzione = { conteggio: conteggioElementi, personeUtilizzate, maxOccorrenze };
                }
            }
        }
        tentativiGlobali++;
    }
    if (!successo) {
        if (migliorDistribuzione) {
            console.warn(`Utilizzo migliore distribuzione trovata: ${migliorDistribuzione.personeUtilizzate} persone, max occorrenze ${migliorDistribuzione.maxOccorrenze}`);
            contaElementi();
        }
        else {
            alert(`Impossibile trovare una combinazione equilibrata dopo ${MAX_TENTATIVI_GLOBALI} tentativi. \n           Suggerimenti:\n           - Verifica che ci siano abbastanza persone negli elenchi CSV\n           - Prova ad aggiungere più nominativi\n           - Riduci il numero di righe nella tabella`);
            console.warn("Generazione fallita - distribuzione non equilibrata");
        }
    }
}
//MODIFICHE MANUALI
// Scelta manuale del mese
const aggiornaDataButton = document.getElementById("aggiorna-data");
aggiornaDataButton.addEventListener("click", function () {
    let meseSelezionato = parseInt(selectMese.value);
    let annoSelezionato = parseInt(annoElementoHTML.value);
    // Verifica se il mese è valido (da 0 a 11) e l'anno è un numero
    if (!isNaN(meseSelezionato) &&
        meseSelezionato >= 0 &&
        meseSelezionato <= 11 &&
        !isNaN(annoSelezionato) &&
        annoSelezionato >= 2024 &&
        annoSelezionato <= 2100) {
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
        }
        else {
            //altrimenti mostra ultima riga
            showRow();
        }
    }
    else {
        alert("Inserisci un mese e un anno validi.");
    }
});
// Cicla le celle e aggiunge i valori come opzioni
function popolaOptionDate() {
    selectData.innerHTML = "";
    selectRow.innerHTML = "";
    selectRowChanging.innerHTML = "";
    celleData.forEach(function (cell, index) {
        if (cell.textContent) {
            let valore = cell.textContent.trim();
            // Creare due opzioni separate per ciascun select
            let option1 = document.createElement("option");
            option1.value = index.toString();
            option1.textContent = valore;
            let option2 = document.createElement("option");
            option2.value = index.toString();
            option2.textContent = valore;
            let option3 = document.createElement("option");
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
    let celle = document.querySelectorAll(".data");
    let cellaSelezionata = celle[indiceCellaSelezionata];
    let pattern = /^(DOMENICA|LUNEDÌ|MARTEDÌ|MERCOLEDÌ|GIOVEDÌ|VENERDÌ|SABATO)\s\d+\/\d+$/;
    // Ottieni il testo da iniettare
    const cambiaDataButton = document.getElementById("cambiaData");
    let testoDaIniettare = cambiaDataButton.value.toUpperCase();
    // Inietta il testo nella cella selezionata
    if (pattern.test(testoDaIniettare)) {
        cellaSelezionata.textContent = testoDaIniettare;
        popolaOptionDate();
    }
    else {
        alert("Inserisci una data valida");
    }
    cambiaDataButton.value = "";
}
const modificaRigaButton = document.getElementById("modifica-riga");
function modificaRiga() {
    // Per inserire del testo al posto dei nominativi
    // Ottieni il valore selezionato dalla option
    let selectedIndex = parseInt(selectRow.value);
    // Trova la riga corrispondente
    const row = celleData[selectedIndex].parentNode;
    // Modifica le celle della riga
    const cells = row.querySelectorAll("td");
    cells.forEach(function (cell) {
        if (cell.classList.contains("addetto-microfonista")) {
            // Trasforma la cella con classe .addetti-audio-video in colspan 5
            cell.colSpan = 5;
            // Inserisci il testo dall'input modifica-riga
            let inputValue = modificaRigaButton.value;
            cell.textContent = inputValue;
        }
        else if (!cell.classList.contains("data")) {
            // Nascondi tutte le altre celle della riga
            cell.style.display = "none";
        }
    });
    modificaRigaButton.value = "";
}
function ripristinaRiga() {
    let selectedIndex = parseInt(selectRow.value);
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
    const prevAssignedRip = getPrevAssigned(selectedIndex);
    popolateRow(row, prevAssignedRip);
}
function aggiornaRiga() {
    let selectedIndex = parseInt(selectRowChanging.value);
    // Trova la riga corrispondente
    let row = celleData[selectedIndex].parentNode;
    const prevAssignedAgg = getPrevAssigned(selectedIndex);
    popolateRow(row, prevAssignedAgg);
}
function showOptions() {
    const showHideButton = document.getElementById("show-hide-last-row");
    const lastOptionData = selectData.lastElementChild;
    const lastOptionRow = selectRow.lastElementChild;
    const lastOptionChanging = selectRowChanging.lastElementChild;
    if (giornoPrimaAdunanzaDelMese + 28 <= ultimoGiorno) {
        alert("Non è possibile nascondere o mostrare l'ultima riga di un giorno di adunanza valido");
    }
    else if (showHideButton.innerText === "Nascondi ultima riga") {
        hideRow();
        showHideButton.textContent = "Mostra ultima riga nascosta";
    }
    else {
        showRow();
        // Controlli di sicurezza per evitare errori null
        if (lastOptionData)
            lastOptionData.style.display = "block";
        if (lastOptionRow)
            lastOptionRow.style.display = "block";
        if (lastOptionChanging)
            lastOptionChanging.style.display = "block";
        showHideButton.textContent = "Nascondi ultima riga";
    }
}
function ripristinaDataRiga() {
    populateDateCell();
    popolaOptionDate();
}
//funzione per cambiare anno dell'input con la rotella del mouse
annoElementoHTML.addEventListener("wheel", (event) => {
    const input = event.target;
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
