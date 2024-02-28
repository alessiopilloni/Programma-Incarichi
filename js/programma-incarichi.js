var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var elencoUScieri = [];
var elencoMicrofonisti = [];
var elencoAudioVideo = [];
function caricaFileCSV() {
    var fileInput = document.getElementById("file-csv");
    var files = fileInput.files;
    if (!files) {
        alert("Nessun file CSV selezionato");
        return;
    }
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var csvData = reader.result;
        var rows = csvData.split("\n");
        // Salta la prima riga (intestazioni)
        rows.shift();
        // Per ogni riga del file CSV...
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var columns = row.split(",");
            // Estrai i dati per ogni colonna
            var nomeUsciere = columns[0];
            var nomeMicrofonista = columns[1];
            var nomeAudioVideo = columns[2];
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
var divMeseProgramma = document.getElementById("mese-programma");
var dataCorrente = new Date();
// Aumentare la data corrente di un mese, così all'apertura è già al mese successivo a quello odierno
dataCorrente.setMonth(dataCorrente.getMonth() + 1);
dataCorrente = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), 1);
// Array dei nomi dei mesi
var nomiMesi = [
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
var meseSuccessivo = nomiMesi[dataCorrente.getMonth()];
var annoSuccessivo = dataCorrente.getFullYear();
var annoElementoHTML = document.getElementById("anno");
annoElementoHTML.value = annoSuccessivo.toString();
var selectMese = document.getElementById("select-mese");
// Cicla attraverso le option della select
for (var i = 0; i < selectMese.options.length; i++) {
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
divMeseProgramma.textContent = "".concat(meseSuccessivo, " ").concat(annoSuccessivo);
var table = document.getElementById("myTable");
var tbody = document.querySelector("tbody");
var rows = tbody.querySelectorAll("tr");
var selectData = document.getElementById("select-data");
var selectRow = document.getElementById("select-row");
var selectRowChanging = document.getElementById("select-row-changing");
function hideRow() {
    var lastOptionData = selectData.lastElementChild;
    var lastOptionRow = selectRow.lastElementChild;
    var lastOptionChanging = selectRowChanging.lastElementChild;
    var rowCount = table.rows.length;
    // Nascondi l'ultima riga le option data del div di modifica
    table.rows[rowCount - 1].style.display = "none";
    lastOptionData.style.display = "none";
    lastOptionRow.style.display = "none";
    lastOptionChanging.style.display = "none";
    var ultimaCellaData = celleData[celleData.length - 1];
    ultimaCellaData.textContent = "DATA";
    lastOptionData.textContent = "DATA";
    lastOptionRow.textContent = "DATA";
    lastOptionChanging.textContent = "DATA";
}
function showRow() {
    var rowCount = table.rows.length;
    // Mostra l'ultima riga
    table.rows[rowCount - 1].style.display = "table-row";
}
// Popolare le date in tabella
var celleData = document.querySelectorAll(".data"); //Salva tutte le celle con campo data
var giornoPrimaAdunanzaDelMese = 1; // Inizializza a 1 o a qualsiasi giorno sia il primo giorno di adunanza del mese
var giornoSettimanaCorrente = 1;
function populateDateCell() {
    var meseCorrente = dataCorrente.getMonth() + 1;
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
    var primoGiornoAdunanza = PrimaGiooDom();
    var giorno1 = primoGiornoAdunanza === 4 ? "GIOVEDÌ" : "DOMENICA";
    var giorno2 = primoGiornoAdunanza === 0 ? "GIOVEDÌ" : "DOMENICA";
    var giornoAdunanza = giornoPrimaAdunanzaDelMese;
    for (var i = 0; i < celleData.length; i += 2) {
        celleData[i].textContent = "".concat(giorno1, " ").concat(giornoAdunanza, "/").concat(meseCorrente);
        giornoAdunanza += 7;
    }
    if (giorno1 === "GIOVEDÌ") {
        giornoAdunanza = giornoPrimaAdunanzaDelMese + 3;
    }
    else {
        giornoAdunanza = giornoPrimaAdunanzaDelMese + 4;
    }
    for (var i = 1; i < celleData.length; i += 2) {
        celleData[i].textContent = "".concat(giorno2, " ").concat(giornoAdunanza, "/").concat(meseCorrente);
        giornoAdunanza += 7;
    }
}
populateDateCell();
var ultimoGiorno = 1;
function ultimoGiornoDelMese(data) {
    // Ottieni il mese successivo
    var meseSuccessivo = new Date(data.getFullYear(), data.getMonth() + 1, 1);
    // Sottrai un giorno dalla data successiva per ottenere l'ultimo giorno del mese corrente
    var dataUltimoGiorno = new Date(meseSuccessivo.getFullYear(), meseSuccessivo.getMonth(), 0);
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
    var conteggio = {};
    rows.forEach(function (row) {
        var cells = row.querySelectorAll("td:not(.data)");
        cells.forEach(function (cell) {
            if (cell.textContent) {
                var elementi = cell.textContent.split(" - ");
                elementi.forEach(function (elemento) {
                    elemento = elemento.trim();
                    if (elemento in conteggio) {
                        conteggio[elemento]++;
                    }
                    else {
                        conteggio[elemento] = 1;
                    }
                });
            }
        });
    });
    var contatoreDiv = document.getElementById("contatore-incarichi");
    var testoContatoreIncarichi = "<strong>Sono stati impiegati i seguenti fratelli:</strong>";
    for (var elemento in conteggio) {
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
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
// Funzione  che verifica che tutti gli addetti siano impiegati
function ciSonoElementiInutilizzati() {
    var rows = tbody.querySelectorAll("tr");
    var conteggio = {};
    rows.forEach(function (row) {
        var cells = row.querySelectorAll("td:not(.data)");
        cells.forEach(function (cell) {
            if (cell.textContent) {
                var elementi = cell.textContent.split(" - ");
                elementi.forEach(function (elemento) {
                    elemento = elemento.trim();
                    if (elemento in conteggio) {
                        conteggio[elemento]++;
                    }
                    else {
                        conteggio[elemento] = 1;
                    }
                });
            }
        });
    });
    // Confronto con gli array
    var elencoCompleto = __spreadArray(__spreadArray(__spreadArray([], elencoUScieri, true), elencoMicrofonisti, true), elencoAudioVideo, true);
    var elementiInutilizzati = elencoCompleto.filter(function (elemento) {
        return !(elemento in conteggio);
    });
    var stringaPrimoElementoInutilizzato = elementiInutilizzati[0];
    return stringaPrimoElementoInutilizzato; // Se tutto ok, sarà vuoto, o meglio undefined
}
function sonoTuttiDiversi() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var visti = {}; // Oggetto per memorizzare gli elementi visti
    // Controllo di tutti gli elementi
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
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
var contaTentativi = 0;
// Funzione per popolare una riga della tabella
function popolateRow(row) {
    var elencoAudioVideoCopy = shuffleArray(__spreadArray([], elencoAudioVideo, true));
    var elencoMicrofonistiCopy = shuffleArray(__spreadArray([], elencoMicrofonisti, true));
    var elencoUScieriCopy = shuffleArray(__spreadArray([], elencoUScieri, true));
    var audioVideoCell = row.querySelector(".addetti-audio-video");
    var microfonistaCell = row.querySelector(".addetto-microfonista");
    var uscieriCell = row.querySelector(".addetti-uscieri");
    var operatoreAudioVideo1 = elencoAudioVideoCopy.pop();
    var operatoreAudioVideo2 = elencoAudioVideoCopy.pop();
    var microfonista = elencoMicrofonistiCopy.pop();
    var usciere1 = elencoUScieriCopy.pop();
    var usciere2 = elencoUScieriCopy.pop();
    // Se ci sono duplicati, rigenera la riga
    while (!sonoTuttiDiversi(operatoreAudioVideo1, operatoreAudioVideo2, microfonista, usciere1, usciere2)) {
        elencoAudioVideoCopy = shuffleArray(__spreadArray([], elencoAudioVideo, true));
        elencoMicrofonistiCopy = shuffleArray(__spreadArray([], elencoMicrofonisti, true));
        elencoUScieriCopy = shuffleArray(__spreadArray([], elencoUScieri, true));
        operatoreAudioVideo1 = elencoAudioVideoCopy.pop();
        operatoreAudioVideo2 = elencoAudioVideoCopy.pop();
        microfonista = elencoMicrofonistiCopy.pop();
        usciere1 = elencoUScieriCopy.pop();
        usciere2 = elencoUScieriCopy.pop();
    }
    audioVideoCell.textContent = "".concat(operatoreAudioVideo1, " - ").concat(operatoreAudioVideo2);
    microfonistaCell.textContent = "".concat(microfonista);
    uscieriCell.textContent = "".concat(usciere1, " - ").concat(usciere2);
    // contaElementi();
}
// Funzione per popolare tutti gli incarichi
function popolaIncarichi() {
    var tentativi = 0;
    var _loop_1 = function () {
        rows.forEach(popolateRow);
        var conteggioElementi = {};
        // Conteggio degli elementi nelle celle non di data
        rows.forEach(function (row) {
            var celleNonData = row.querySelectorAll("td:not(.data)");
            celleNonData.forEach(function (cella) {
                if (cella.textContent) {
                    var contenuto = cella.textContent.trim();
                    var elementi = contenuto.split(" - ");
                    elementi.forEach(function (elemento) {
                        conteggioElementi[elemento] = (conteggioElementi[elemento] || 0) + 1;
                    });
                }
            });
        });
        // Verifica se c'è almeno un elemento con più di 3 occorrenze e tutti gli
        // incaricati sono stati inseriti almeno una volta
        var almenoUnElementoSuperioreAMax = false;
        for (var _i = 0, _a = Object.keys(conteggioElementi); _i < _a.length; _i++) {
            var count = _a[_i];
            if (conteggioElementi[count] > 3) {
                almenoUnElementoSuperioreAMax = true;
                break;
            }
        }
        if (!almenoUnElementoSuperioreAMax && !ciSonoElementiInutilizzati()) {
            contaElementi();
            console.log(tentativi);
            return "break";
        }
        tentativi++;
    };
    while (true) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
}
//MODIFICHE MANUALI
// Scelta manuale del mese
var aggiornaDataButton = document.getElementById("aggiorna-data");
aggiornaDataButton.addEventListener("click", function () {
    var meseSelezionato = parseInt(selectMese.value);
    var annoSelezionato = parseInt(annoElementoHTML.value);
    // Verifica se il mese è valido (da 0 a 11) e l'anno è un numero
    if (!isNaN(meseSelezionato) &&
        meseSelezionato >= 0 &&
        meseSelezionato <= 11 &&
        !isNaN(annoSelezionato) &&
        annoSelezionato >= 2024 &&
        annoSelezionato <= 2100) {
        dataCorrente = new Date(annoSelezionato, meseSelezionato, 1);
        // Aggiorna il valore nel div
        divMeseProgramma.textContent = "".concat(nomiMesi[meseSelezionato], " ").concat(annoSelezionato);
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
            var valore = cell.textContent.trim();
            // Creare due opzioni separate per ciascun select
            var option1 = document.createElement("option");
            option1.value = index.toString();
            option1.textContent = valore;
            var option2 = document.createElement("option");
            option2.value = index.toString();
            option2.textContent = valore;
            var option3 = document.createElement("option");
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
    var indiceCellaSelezionata = parseInt(selectData.value);
    var celle = document.querySelectorAll(".data");
    var cellaSelezionata = celle[indiceCellaSelezionata];
    var pattern = /^(DOMENICA|LUNEDÌ|MARTEDÌ|MERCOLEDÌ|GIOVEDÌ|VENERDÌ|SABATO)\s\d+\/\d+$/;
    // Ottieni il testo da iniettare
    var cambiaDataButton = document.getElementById("cambiaData");
    var testoDaIniettare = cambiaDataButton.value.toUpperCase();
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
var modificaRigaButton = document.getElementById("modifica-riga");
function modificaRiga() {
    // Per inserire del testo al posto dei nominativi
    // Ottieni il valore selezionato dalla option
    var selectedIndex = parseInt(selectRow.value);
    // Trova la riga corrispondente
    var row = celleData[selectedIndex].parentNode;
    // Modifica le celle della riga
    var cells = row.querySelectorAll("td");
    cells.forEach(function (cell) {
        if (cell.classList.contains("addetto-microfonista")) {
            // Trasforma la cella con classe .addetti-audio-video in colspan 5
            cell.colSpan = 5;
            // Inserisci il testo dall'input modifica-riga
            var inputValue = modificaRigaButton.value;
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
    var selectedIndex = parseInt(selectRow.value);
    // Trova la riga corrispondente
    var row = celleData[selectedIndex].parentNode;
    // Modifica le celle della riga
    var cells = row.querySelectorAll("td");
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
    var selectedIndex = parseInt(selectRowChanging.value);
    // Trova la riga corrispondente
    var row = celleData[selectedIndex].parentNode;
    popolateRow(row);
}
function showOptions() {
    var showHideButton = document.getElementById("show-hide-last-row");
    var lastOptionData = selectData.lastElementChild;
    ;
    var lastOptionRow = selectRow.lastElementChild;
    ;
    var lastOptionChanging = selectRowChanging.lastElementChild;
    if (giornoPrimaAdunanzaDelMese + 28 <= ultimoGiorno) {
        alert("Non è possibile nascondere o mostrare l'ultima riga di un giorno di adunanza valido");
    }
    else if (showHideButton.innerText === "Nascondi ultima riga") {
        hideRow();
        showHideButton.textContent = "Mostra ultima riga nascosta";
    }
    else {
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
annoElementoHTML.addEventListener("wheel", function (event) {
    var input = event.target;
    if (input && typeof input.value === "string") {
        var newValue = parseInt(input.value) + (event.deltaY > 0 ? -1 : 1);
        var min = parseInt(input.min || "0");
        var max = parseInt(input.max || "100");
        if (newValue >= min && newValue <= max) {
            input.value = newValue.toString();
        }
    }
    event.preventDefault(); // Non fa scorrere la pagina
});
