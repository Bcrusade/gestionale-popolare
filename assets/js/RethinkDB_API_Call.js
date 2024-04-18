// Funzione principale che viene eseguita una volta che il DOM è pronto
document.addEventListener("DOMContentLoaded", function () {
  // URL dell'API da cui ottenere i dati JSON
  const apiUrl = "http://192.168.1.9:3000/api/menu";

  // Carica i dati JSON dall'API e avvia l'applicazione
  loadExternalJsonAndInitialize(apiUrl);
  //console.log(idOrdineCreato);
});

// Modifica la funzione loadExternalJsonAndInitialize per utilizzare la chiamata API
async function loadExternalJsonAndInitialize(apiUrl) {
  try {
    const response = await fetch(apiUrl); // Esegui la chiamata API
    console.log("Chiamata API riuscita:", response);
    const json = await response.json(); // Estrai i dati JSON dalla risposta

    // Inizializza l'applicazione con il JSON caricato
    initializeApp(json);

    // Simula un click sulla prima categoria per avviare il caricamento del menu promozionale
    const primaCategoriaCheckbox = document.querySelector(
      '#category-list input[type="checkbox"]'
    );
    primaCategoriaCheckbox.click();
  } catch (error) {
    console.error("Errore nel caricamento dei dati dall'API:", error);
  }
}

// Oggetto per memorizzare le variabili prezzoIniziale associate agli ID del menu
const prezzoInizialeMap = {};
// Dichiarazione della variabile globale prezzoIniziale
let prezzoIniziale = 0;
// Dichiarare le variabili globali per salvare le informazioni desiderate
let globalPrice;
let globalQuantity;
let globalImage;
let globalName;
let globalID;
let globalNote;

// Variabile per salvare la somma di tutti i valori in globalPrice
let totalPriceSum = 0;
// Variabile per salvare i totale di tutti i valori in globalPrice
let grandTotal = 0;
// Dichiarazione di una variabile per tenere traccia del numero d'ordine
let numeroOrdineIncrementale = 0;
// Dichiarazione dell'array al di fuori della funzione
let OrderItemList = [];
// Variabile globale per la somma INCASSO totale
let OrderTotalSum = 0;
let OrderdTotalClient = 0;
let OrderdTotalGuest = 0;
// Dichiarare la variabile globale per l'array di ordini
//let OredNub = [];
// Dichiarare la variabile globale per i dati dell'ordine JSON
let orderData = [];
// Contatore globale per OrderNub
let orderNubCounter = 1;
// Dichiarazione della variabile globale per salvare l'ID dell'ordine
let idOrdineCreato;

function clearContainers() {
  const containerRiepilogo = document.getElementById("container-riepilogo");
  const containerTotale = document.getElementById("Totale");

  if (containerRiepilogo && containerTotale) {
    // Rimuovere tutto il contenuto HTML dal div "container-riepilogo"
    containerRiepilogo.innerHTML = "";

    // Rimuovere tutto il contenuto HTML dal div "Totale"
    containerTotale.innerHTML = "";

    console.log("Contenuto dei container eliminato con successo.");
  } else {
    console.error("Errore: Impossibile trovare uno o entrambi i container.");
  }
}

// Funzione per inizializzare l'applicazione con il JSON (Lista prodotti) fornito
function initializeApp(json) {
  // Mappa delle categorie ai rispettivi array di menu
  const categorieMenuMap = {
    pizza: json.find((category) => category.category === "pizza")?.items || [],
    panini_singoli:
      json.find((category) => category.category === "panini")?.items || [],
    menu_birra:
      json.find((category) => category.category === "menu birra")?.items || [],
    cucina:
      json.find((category) => category.category === "cucina")?.items || [],
    bevande:
      json.find((category) => category.category === "bevande")?.items || [],
    menu_bibita:
      json.find((category) => category.category === "menu bibita")?.items || [],
  };
  // Funzione per generare HTML dinamico basato sulle variabili globali
  function generateDynamicHTML() {
    // Creare un array di dettagli dell'oggetto basato sulle variabili globali
    const objectDetailsArray = [
      {
        img: globalImage,
        name: globalName,
        quantity: globalQuantity,
        price: globalPrice,
        ID: "riepilogo_" + globalID,
        note: globalNote,
      },
      // Puoi aggiungere altri oggetti all'array se necessario
    ];

    // Dichiarare la variabile locale per la lista dei totali
    let totalPriceList = [];

    // Selezionare il container in cui si desidera aggiungere l'HTML (sostituire 'container-id' con il tuo effettivo ID del container)
    const container = document.getElementById("container-riepilogo");

    // Loop attraverso l'array di dettagli dell'oggetto
    objectDetailsArray.forEach((objectDetails, index) => {
      // Aggiungere il prezzo corrente alla somma totale
      totalPriceSum += parseFloat(objectDetails.price);

      // Creare un nuovo div per ogni oggetto
      const objectDiv = document.createElement("div");
      // Impostare l'ID univoco
      objectDiv.id = objectDetails.ID;
      objectDiv.className = "flex items-center mb-4";

      // Verifica se objectDetails.note è maggiore di 0 prima di aggiungere l'elemento <i>
      const noteHtml =
        objectDetails.note && objectDetails.note.trim().length > 0
          ? `<i class="text-sm text-default-600 font-bold text-primary">- ${objectDetails.note}</i>`
          : "";

      objectDiv.innerHTML = `
        <!-- <img src="${objectDetails.img}" class="h-20 w-20 me-2"> -->
        <div>
          <h4 id="objectDetailsName" class="text-sm text-default-600 mb-2 font-bold">${objectDetails.name}</h4>
          ${noteHtml}
          <h4 class="text-sm text-default-400 font-bold">${objectDetails.quantity} x <span class="text-primary font-semibold">€${objectDetails.price}</span>
          <button style="float: right;" class="font-bold text-default-950">X</button></h4>
        </div>
      `;

      // Aggiungere il listener di evento al pulsante "X"
      const deleteButton = objectDiv.querySelector("button");
      deleteButton.addEventListener("click", () => {
        // Chiamare la funzione di eliminazione passando l'indice corrente
        deleteObject(index);
      });

      // Aggiungere il nuovo div al container senza cancellare quello già esistente
      container.appendChild(objectDiv);
    });

    // Calcolare la somma totale di tutti i valori nella lista
    grandTotal = totalPriceList.reduce(
      (acc, currentTotal) => acc + currentTotal,
      0
    );

    // Aggiungere il valore corrente alla somma totale
    grandTotal += totalPriceSum;

    // Aggiungere il valore corrente alla lista dei totali
    totalPriceList.push(totalPriceSum);

    // Ora puoi utilizzare la variabile totalPriceSum per ottenere la somma totale dei prezzi
    console.log("Totale riepilogo:", grandTotal);

    // Selezionare l'elemento <p> con l'ID "Totale"
    const totaleElement = document.getElementById("Totale");

    // Aggiornare il contenuto dell'elemento con la somma totale
    totaleElement.textContent = `€ ${grandTotal.toFixed(2)}`;

    if (totalPriceList > 0) {
      // Ottieni il riferimento al bottone "check-out"
      var checkoutButton = document.getElementById("check-out");

      // Toggle della classe opacity-50 sul div del bottone "check-out"
      checkoutButton.classList.remove("opacity-50");
    }

    // // Aggiungere il valore corrente alla lista dei totali
    // OredNub.push({
    //   name: globalName,
    //   note: globalNote,
    //   quantity: globalQuantity,
    //   price: globalPrice,
    // });

    // Ora puoi utilizzare la variabile totalPriceSum per ottenere la somma totale dei prezzi
    //console.log("Ordine Array:", OredNub);

    // Creare un oggetto di dettagli dell'ordine basato sulle variabili globali
    const orderDetailsObject = {
      name: globalName,
      quantity: globalQuantity,
      price: globalPrice,
      note: globalNote,
      guest: GuestTypeSelectedInput,
    };

    // Aggiungere i dati correnti alla variabile globale orderData
    orderData.push(orderDetailsObject);

    // Ora puoi utilizzare orderDataJson per ottenere la rappresentazione JSON dei dati dell'ordine
    console.log("orderDetailsObject - Ordine:", orderDetailsObject);

    // Convertire l'oggetto in una stringa JSON e assegnarla a orderDataJson
    let orderDataJson = JSON.stringify(orderData);

    // Ora puoi utilizzare orderDataJson per ottenere la rappresentazione JSON dei dati dell'ordine
    console.log("orderDataJson - Ordine JSON:", orderDataJson);
    // Ora puoi utilizzare orderDataJson per ottenere la rappresentazione JSON dei dati dell'ordine
    console.log(" orderData Ordine:", orderData);

    // Funzione di eliminazione voce
    function deleteObject(index) {
      // Selezionare il div padre da rimuovere
      const container = document.getElementById("container-riepilogo");
      const divToRemove = document.getElementById(objectDetailsArray[index].ID);

      // Selezionare l'elemento "objectDetailsName" all'interno del divToRemove
      const objectDetailsName = divToRemove.querySelector("#objectDetailsName");

      if (objectDetailsName) {
        const objToRemoveFromJson = objectDetailsName.textContent.trim();
        console.log(objToRemoveFromJson);

        // Trova l'indice dell'elemento nell'array che ha il campo 'name' uguale a objToRemoveFromJson
        const indexToRemove = orderData.findIndex(
          (obj) => obj.name === objToRemoveFromJson
        );

        if (indexToRemove !== -1) {
          // Rimuovi l'elemento trovato dall'array
          const removedElement = orderData.splice(indexToRemove, 1)[0]; // Rimuovi e salva l'elemento rimosso

          // Se desideri convertirlo nuovamente in JSON
          const updatedOrderDataJson = JSON.stringify(orderData);

          // Ora updatedOrderDataJson contiene il JSON aggiornato senza l'oggetto che aveva il name corrispondente a objToRemoveFromJson

          // Aggiungi un console.log per visualizzare il JSON aggiornato
          console.log(
            "JSON aggiornato (senza l'elemento eliminato):",
            updatedOrderDataJson
          );

          // Rimuovere l'elemento corrispondente dall'array di dettagli dell'oggetto
          const removedObjectPrice = parseFloat(
            objectDetailsArray[index].price
          );
          objectDetailsArray.splice(index, 1);

          // Rimuovere il div dal DOM
          container.removeChild(divToRemove);

          // Sottrarre il prezzo dell'oggetto eliminato dalla somma totale
          grandTotal -= removedObjectPrice;

          // Assicurarsi che grandTotal non diventi mai negativo
          grandTotal = Math.max(0, grandTotal);

          // Aggiornare il contenuto dell'elemento con la nuova somma totale
          totaleElement.textContent = `€ ${grandTotal.toFixed(2)}`;

          console.log("Totale aggiornato dopo l'eliminazione:", grandTotal);

          // Aggiornare totalPriceSum sottraendo il prezzo dell'oggetto eliminato
          totalPriceSum -= removedObjectPrice;

          // Assicurarsi che totalPriceSum non diventi mai negativo
          totalPriceSum = Math.max(0, totalPriceSum);

          console.log("Totale riepilogo aggiornato:", totalPriceSum);

          // Aggiungi un console.log per visualizzare l'elemento eliminato
          console.log("Elemento eliminato:", removedElement);

          // Aggiorna l'ordine dei dati con i nuovi dati
          // Non è necessario aggiornare orderDataJson in questo caso
          console.log("orderData aggiornato:", orderData);
        } else {
          // Log se l'elemento non è stato trovato nell'array
          console.error(
            "Errore: L'elemento da rimuovere non è stato trovato nell'array."
          );
        }
      } else {
        // Log se l'elemento objectDetailsName non è stato trovato all'interno di divToRemove
        console.error(
          "Errore: L'elemento objectDetailsName non è stato trovato."
        );
      }
    }
  }

  // Aggiungi l'evento di click all'elemento con ID "check-out"
  const checkoutButton = document.getElementById("check-out");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
      if (grandTotal !== 0) {
        // Chiamare la funzione saveValuesOnCheckout
        saveValuesOnCheckout();
        // Chiamare la funzione per eseguire l'eliminazione
        clearContainers();
        // Toggle della classe opacity-50 sul div del bottone "check-out"
        checkoutButton.classList.add("opacity-50");

        // Ottenere il JSON risultante dalla variabile globale orderData
        let orderDataJson = JSON.stringify(orderData);

        // Chiamare la funzione transformAndSaveOrderData con il JSON risultante
        const transformedOrderData = transformAndSaveOrderData(orderDataJson);

        // Chiama la funzione per inviare i dati dell'ordine al database
        inviaDatiOrdine();

        // // Chiamata alla funzione inviaDatiIncasso con le variabili globali necessarie come parametri
        // if (
        //   OrderTotalSum !== null &&
        //   OrderdTotalClient !== null &&
        //   OrderdTotalGuest !== null
        // ) {
        //   inviaDatiIncasso(OrderTotalSum, OrderdTotalClient, OrderdTotalGuest);

        //   // Utilizza setTimeout per ritardare l'esecuzione di showPopupOrderData di 1 secondo
        //   setTimeout(function () {
        //     // Chiamare la funzione showPopupOrderData con i dati trasformati
        //     showPopupOrderData(transformedOrderData, grandTotal);
        //     // Svuotare le variabile
        //     orderData = [];
        //     totalPriceSum = 0;
        //     grandTotal = 0;
        //   }, 500);
        // } else {
        //   console.error(
        //     "Le variabili globali non sono definite correttamente."
        //   );
        // }

        // Utilizza setTimeout per ritardare l'esecuzione di showPopupOrderData di 1 secondo
        setTimeout(function () {
          // Chiamare la funzione showPopupOrderData con i dati trasformati
          showPopupOrderData(transformedOrderData, grandTotal);
          // Svuotare le variabile
          orderData = [];
          totalPriceSum = 0;
          grandTotal = 0;
        }, 500);
      } else {
        // Alert o messaggio che informa l'utente che non può effettuare il check-out
        toastr.error("Il carrello è vuoto!", "Errore");
      }
    });
  }

  // Funzione per inviare i dati dell'ordine al database
  function inviaDatiOrdine() {
    // Crea un oggetto con i dati dell'ordine
    const datiOrdineConNumero = {
      guest: GuestTypeSelectedInput,
      order: numeroOrdineIncrementale,
      total: grandTotal,
    };

    console.log("Dati dell'ordine:", datiOrdineConNumero);

    // Esegui la richiesta POST
    fetch("http://192.168.1.9:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datiOrdineConNumero),
    })
      .then((response) => response.json())
      .then((data) => {
        // Salva l'ID dell'ordine nella variabile globale
        idOrdineCreato = data.id;
        console.log("Nuovo ordine creato:", datiOrdineConNumero);

        // Aggiorna il campo dell'ordine visualizzato con l'ID restituito dal server
        console.log(
          `Nuovo ordine creato con successo! Numero ordine: ${idOrdineCreato}`
        );
      })
      .catch((error) => console.error("Errore:", error));
  }

  // // Definizione della funzione inviaDatiIncasso che accetta le variabili globali come parametri
  // function inviaDatiIncasso(
  //   OrderTotalSum,
  //   OrderdTotalClient,
  //   OrderdTotalGuest
  // ) {
  //   // Crea un oggetto con i dati dell'incasso
  //   const datiIncasso = {
  //     OrderTotalSum: OrderTotalSum,
  //     OrderdTotalClient: OrderdTotalClient,
  //     OrderdTotalGuest: OrderdTotalGuest,
  //   };

  //   console.log("Dati dell'incasso:", datiIncasso);

  //   fetch("http://192.168.1.9:3000/api/incassi", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(datiIncasso),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => console.log(data))
  //     .catch((error) => console.error("Errore:", error));
  // }

  // Aggiungi un listener per l'evento beforeunload per assicurarti che i dati vengano salvati prima di lasciare la pagina
  window.addEventListener("beforeunload", () => {
    saveToLocalStorage();
    salvaNumeroOrdineLocalStorage();
  });

  // Funzione per salvare i valori
  function saveValuesOnCheckout() {
    if (grandTotal !== 0) {
      const currentItem = {
        gust: GuestTypeSelectedInput,
        order: numeroOrdineIncrementale,
        total: grandTotal,
      };

      numeroOrdineIncrementale++;
      OrderItemList.push(currentItem);

      // Richiama la funzione per salvare i dati nel localStorage
      saveToLocalStorage();
      // Richiama la funzione per calcolare e salvare la somma totale
      calculateAndSaveOrderTotalSum();
      // Richiama la funzione per salvare il totale dell'ordine nel localStorage
      saveOrderTotalToLocalStorage(grandTotal);

      console.log("Valori salvati con successo:", currentItem);
      console.log("Totale ordini:", numeroOrdineIncrementale);
    } else {
      console.error("Errore: Almeno uno dei valori da salvare è undefined.");
      toastr.error("Aggiungi almeno un prodotto a carrello!", "Errore");
    }
  }

  // Funzione per salvare il totale dell'ordine nel local storage in base al tipo di cliente
  function saveOrderTotalToLocalStorage(grandTotal) {
    // Controlla il valore di GuestTypeSelectedInput
    if (GuestTypeSelectedInput === "Client") {
      // Somma il valore precedente con il nuovo grandTotal
      OrderdTotalClient += grandTotal;
      // Salva OrderdTotalClient nel local storage
      localStorage.setItem("OrderdTotalClient", OrderdTotalClient);
      console.log(
        'Totale dell\'ordine salvato per il cliente "Client":',
        OrderdTotalClient
      );
    } else if (GuestTypeSelectedInput === "Guest") {
      // Somma il valore precedente con il nuovo grandTotal
      OrderdTotalGuest += grandTotal;
      // Salva OrderdTotalGuest nel local storage
      localStorage.setItem("OrderdTotalGuest", OrderdTotalGuest);
      console.log(
        'Totale dell\'ordine salvato per il cliente "Guest":',
        OrderdTotalGuest
      );
    }
  }

  // Funzione per agiungere nemro ordine a orderData
  function transformAndSaveOrderData(orderData) {
    // Convertire la stringa JSON in un array di oggetti
    const orderArray = JSON.parse(orderData);

    // Creare un oggetto contenitore con una chiave incrementale "OrderNub"
    const transformedData = {
      [`${orderNubCounter}`]: [],
    };

    // Riempire l'array dell'oggetto contenitore
    orderArray.forEach((orderDetails) => {
      transformedData[`${orderNubCounter}`].push(orderDetails);
    });

    // Incrementare il contatore globale per la prossima chiamata
    orderNubCounter++;

    // Convertire l'oggetto in una stringa JSON
    const transformedDataJson = JSON.stringify(transformedData);

    // Ora puoi utilizzare transformedDataJson per ottenere la rappresentazione JSON dei dati trasformati
    console.log("Dati trasformati JSON:", transformedDataJson);

    // Restituire la stringa JSON risultante
    return transformedDataJson;
  }

  // Funzione per creare e mostrare il pop-up con i dati trasformati
  function showPopupOrderData(transformedDataJson, grandTotal) {
    // JSON da parsare
    const jsonData = transformedDataJson;
    // Converti la stringa JSON in un oggetto JavaScript
    const orderData = JSON.parse(jsonData);
    console.log(jsonData);

    // Ottieni la chiave dinamica (potrebbe essere la prima chiave dell'oggetto)
    const orderKey = Object.keys(orderData)[0];

    // Ottieni l'array di oggetti dalla chiave dinamica
    const orderItems = orderData[orderKey];

    // Ottieni il contenitore del pop-up
    const popupContainer = document.getElementById("popup-container");

    const GragrandTotal = grandTotal;
    console.log(idOrdineCreato);

    // Creare HTML dinamico con i dati mappati
    let htmlContent = `<h4 class="text-base text-default-700 font-bold">Ordine N.${idOrdineCreato}</h4>`;
    const noteHtml = `
    <div class="flex justify-between m-3">
      <p class="text-base text-default-700 font-bold">Totale: </p>
      <p class="text-base text-default-700 font-medium">${GragrandTotal} €</p>
    </div>
    <div class="flex justify-center mt-4">
      <button id="btn-confirm-order" onclick="confirmPopup()" class="w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500">Stampa</button>
    </div>
  `;
    orderItems.forEach((item) => {
      htmlContent += `
      <div>
          <h4 class="mt-1.5 mb-1.5 text-default-600 text-sm ">Piatto: <span class="px-5 py-3 whitespace-nowrap text-sm text-default-800">${item.name}</span></h4>
          <h4 class="mt-1.5 mb-1.5 text-default-600 text-sm ">Quantità:<span class="px-5 py-3 whitespace-nowrap text-sm text-default-800">${item.quantity}</span></h4>
          <h4 class="mt-1.5 mb-1.5 text-default-600 text-sm ">Prezzo: <span class="px-5 py-3 whitespace-nowrap text-sm text-default-800">${item.price} €</span></h4>
          <h4 class="mt-1.5 mb-1.5 text-default-600 text-sm ">Note: <span class="px-5 py-3 whitespace-nowrap text-sm text-default-800">${item.note}</span></h4>
      </div>
      <hr>

    `;
    });
    htmlContent += noteHtml;
    //console.log(htmlContent);

    // Assegna l'HTML al contenitore del pop-up
    popupContainer.innerHTML = `<span class="font-semibold text-primary text-xl no-print" id="close-button" onclick="closePopup()">X</span>${htmlContent}`;

    // Mostra il pop-up
    popupContainer.style.display = "block";

    // Aggiungi il codice per mostrare l'overlay
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";

    // Aggiungi un event listener al bottone di stampa
    const printButton = document.getElementById("btn-confirm-order"); // Assicurati di sostituire 'printButton' con l'id del tuo bottone
    printButton.addEventListener("click", function () {
      // Chiamata alla funzione per stampare direttamente i dati
      printOrderData(transformedDataJson, grandTotal);
      // Mostra un alert per confermare che la stampa è stata avviata
      // alert("La stampa è stata avviata con successo!");
    });
  }

  function printOrderData(transformedDataJson, grandTotal) {
    // JSON da parsare
    const jsonData = transformedDataJson;
    // Converti la stringa JSON in un oggetto JavaScript
    const orderData = JSON.parse(jsonData);

    // Ottieni la chiave dinamica (potrebbe essere la prima chiave dell'oggetto)
    const orderKey = Object.keys(orderData)[0];

    // Ottieni l'array di oggetti dalla chiave dinamica
    const orderItems = orderData[orderKey];

    // Ottieni il totale
    const GragrandTotal = grandTotal;

    // Creare HTML dinamico con i dati mappati
    let htmlContent = `<div id="print-content">`;
    htmlContent += `<h4 class="text-base text-default-700 font-bold">Ordine N.${idOrdineCreato}</h4>`;
    orderItems.forEach((item) => {
      htmlContent += `
         <div>
            <span>${item.quantity}</span>
            <span>${item.name}</span>
            <span style="margin-left:20px">      ${item.price} €</span>
         </div>
     `;
    });
    htmlContent += `
     <div>
         <h4 class="mt-1.5 mb-1.5 text-default-600 text-sm text-primary">TOTALE: <span class="px-5 py-3 whitespace-nowrap text-sm text-default-800 text-primary">${GragrandTotal} €</span></h4>
     </div>
 `;
    htmlContent += `</div>`;

    // Chiamata alla funzione per inviare i dati al server
    //sendDataToServer();


    // Creazione di un elemento div temporaneo nel DOM
    const printContainer = document.createElement("div");
    printContainer.innerHTML = htmlContent;
    document.body.appendChild(printContainer);

    // Chiamata alla funzione per inviare l'HTML  Comanda al server
    //sendHTMLToServer(htmlContent);

    // Stampare l'elemento HTML utilizzando Print.js con la stampante specificata
    printJS({
      printable: "print-content", // Utilizza l'ID del div come riferimento
      type: "html",
      showModal: false, // Impedisci l'apertura della finestra di dialogo di stampa del browser
      printer: "POS-58", // Specifica il nome della stampante di rete desiderata
    });

    // Rimuovere l'elemento div temporaneo dal DOM dopo la stampa
    document.body.removeChild(printContainer);
  }


  // Test funzione per inviare dati al server
  // const sendDataToServer = async () => {
  //   try {
  //     // Dati da inviare al server
  //     const data = {
  //       nome: 'Mario',
  //       cognome: 'Rossi',
  //       eta: 30
  //     };

  //     // Effettua una richiesta POST al server
  //     const response = await fetch('http://localhost:3000/api/sendData', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Errore durante la richiesta al server');
  //     }

  //     const responseData = await response.json();
  //     console.log('Risposta dal server:', responseData);
  //   } catch (error) {
  //     console.error('Si è verificato un errore:', error.message);
  //   }
  // };



  // Invio Html per stampa da remoto Comanda
  // const sendHTMLToServer = async (htmlContent) => {
  //   try {
  //     // Effettua una richiesta POST al server
  //     const response = await fetch('http://localhost:3000/api/sendHTML', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'text/plain' // Imposta il tipo di contenuto come testo semplice
  //       },
  //       body: getPlainTextFromHTML(htmlContent) // Converti l'HTML in testo semplice prima di inviarlo
  //     });

  //     if (!response.ok) {
  //       throw new Error('Errore durante la richiesta al server');
  //     }

  //     const responseData = await response.json();
  //     console.log('Risposta dal server:', responseData);
  //     console.log('htmlContent:', htmlContent);
  //   } catch (error) {
  //     console.error('Si è verificato un errore:', error.message);
  //   }
  // };

  // // Funzione per estrarre il testo dal contenuto HTML
  // const getPlainTextFromHTML = (htmlContent) => {
  //   // Crea un elemento HTML temporaneo
  //   const tempElement = document.createElement('div');
  //   // Imposta il contenuto HTML dell'elemento temporaneo
  //   tempElement.innerHTML = htmlContent;
  //   // Estrai il testo dall'elemento temporaneo
  //   const plainText = tempElement.textContent || tempElement.innerText || '';
  //   // Rimuovi l'elemento temporaneo
  //   tempElement.remove();
  //   console.log(plainText);
  //   // Ritorna il testo estratto
  //   return plainText;

  // };






  // Funzione per stampare i dati dell'ordine
  // function printOrderData(PrintHtmlContent) {
  //   const printWindow = window.open("", "_blank");
  //   const doc = printWindow.document;

  //   // Aggiungi stile per la larghezza della pagina
  //   doc.write(style);

  //   // Aggiungi il contenuto HTML al documento di stampa
  //   doc.open();
  //   doc.write(PrintHtmlContent);
  //   doc.close();

  //   // Avvia la finestra di dialogo di stampa del browser
  //   printWindow.print();
  //   printWindow.close();
  // }

  // Funzione per caricare i dati dal localStorage
  // function loadFromLocalStorage() {
  //   // Carica l'array
  //   OrderItemList = JSON.parse(localStorage.getItem("OrderItemList")) || [];

  //   // Carica la somma totale
  //   OrderTotalSum = parseFloat(localStorage.getItem("OrderTotalSum"), 10) || 0;

  //   // Carica ordini totali
  //   numeroOrdineIncrementale =
  //     parseInt(localStorage.getItem("TotalOrder"), 10) || 0;

  //   // Carica OrderdTotalClient
  //   OrderdTotalClient =
  //     parseFloat(localStorage.getItem("OrderdTotalClient"), 10) || 0;

  //   // Carica OrderdTotalGuest
  //   OrderdTotalGuest =
  //     parseFloat(localStorage.getItem("OrderdTotalGuest"), 10) || 0;
  // }

  // Funzione per salvare i dati nel localStorage
  function saveToLocalStorage() {
    localStorage.setItem("OrderItemList", JSON.stringify(OrderItemList));
    localStorage.setItem("OrderTotalSum", OrderTotalSum.toString());
    localStorage.setItem("TotalOrder", numeroOrdineIncrementale.toString());
    localStorage.setItem("OrderdTotalClient", OrderdTotalClient.toString());
    localStorage.setItem("OrderdTotalGuest", OrderdTotalGuest.toString());
  }

  // Funzione per calcolare e salvare la somma totale
  function calculateAndSaveOrderTotalSum() {
    OrderTotalSum = OrderItemList.reduce(
      (sum, currentItem) => sum + currentItem.total,
      0
    );
    saveToLocalStorage();
    console.log("Somma totale INCASSO calcolata e salvata:", OrderTotalSum);
  }

  // Funzione per gestire il click sulla categoria
  function categoriaClick(event) {
    // Deseleziona la categoria precedentemente selezionata
    const categorieSelezionate = document.querySelectorAll(
      '#category-list input[type="checkbox"]:checked'
    );
    categorieSelezionate.forEach((categoria) => {
      categoria.checked = false;
    });

    // Seleziona la categoria cliccata
    const checkbox = event.currentTarget.querySelector(
      'input[type="checkbox"]'
    );
    checkbox.checked = true;

    // Ottieni l'ID della categoria cliccata
    const categoryId = checkbox.id;

    // Esegui le azioni desiderate con l'ID della categoria
    console.log(`Hai cliccato sulla categoria con ID: ${categoryId}`);

    // Aggiorna il menu in base alla categoria selezionata
    updateMenu(categoryId);
  }

  // Funzione per aggiornare il menu in base alla categoria selezionata
  function updateMenu(categoryId) {
    // Seleziona il container del menu
    const containerMenu = document.getElementById("container-menu");

    // Seleziona l'array di menu corrispondente alla categoria
    const arrayMenu = categorieMenuMap[categoryId];

    // Dichiarare la variabile addCartButton fuori dal ciclo
    let addCartButton;

    // Controlla se l'array esiste e ha una proprietà 'length'
    if (Array.isArray(arrayMenu) && arrayMenu.length > 0) {
      // Pulisci il container del menu
      containerMenu.innerHTML = "";

      // Funzione per generare un ID univoco basato sul nome e sull'ID della categoria senza spazi
      function generateUniqueId(name, categoryId) {
        // Sostituisci gli spazi con l'underscore, convergi tutto in minuscolo e aggiungi un prefisso
        const cleanedName = name.replace(/\s/g, "_").toLowerCase();
        const cleanedCategoryId = categoryId.replace(/\s/g, "_").toLowerCase();
        return `${cleanedCategoryId}-${cleanedName}`;
      }

      // Ciclo sugli oggetti dell'array e generazione dinamica degli elementi del menu
      for (let i = 0; i < arrayMenu.length; i++) {
        const oggetto = arrayMenu[i];

        // Creazione dell'elemento del menu con un ID univoco basato sul nome e l'ID della categoria
        const menuElement = document.createElement("div");
        const menuId = generateUniqueId(oggetto.name, categoryId); // Aggiunto categoryId come secondo parametro
        menuElement.id = menuId;
        menuElement.className =
          "xl:order-1 order-2 border border-default-200 rounded-lg p-4 overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300";

        // Inizializza la variabile prezzoIniziale per questo ID se non esiste
        if (!prezzoInizialeMap[menuId]) {
          prezzoInizialeMap[menuId] = parseFloat(oggetto.price) || 0;
        }

        menuElement.innerHTML = `
            
        <div class="relative rounded-lg overflow-hidden divide-y divide-default-200 group">
          <div class="mb-4 mx-auto">
            <img class="w-full h-full group-hover:scale-105 transition-all" src="${oggetto.img}" />
          </div>
  
          <div class="pt-2">
            <div id="obj-desc-container" style="flex-flow: column;" class="flex justify-between mb-4">
              <span class="text-default-800 text-xl font-semibold line-clamp-1 after:absolute after:inset-0">${oggetto.name}</span>
              <i class="text-m text-default-500">${oggetto.desc}</i>
              <div class="border border-default-200 inline-flex justify-between mt-2 p-1 relative rounded-full z-10 truncate overflow-auto">
              <input id="input_${menuId}" type="text" placeholder="Inserisci modifiche" class="bg-white border-none dark:bg-default-50 h-3 overflow-auto truncate w-full" />
              </div>
            </div>
  
            <div class="flex items-end justify-between mb-4">
              <h4 class="font-semibold text-xl text-default-900">€ ${oggetto.price}</h4>
              <div class="relative z-10 inline-flex justify-between border border-default-200 p-1 rounded-full">
                <button class="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center" type="button">–</button>
                <input id="quantity_${menuId}" class="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent" max="100" min="0" readonly="" type="text" value="1" />
                <button class="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center" type="button">+</button>
              </div>

            </div>
  
            <a id="add-cart" class="relative z-10 w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500" href="cart.html">Aggiungi al carrello</a>
          </div>
        </div>
      
            `;

        // Aggiungi eventi di click ai pulsanti e all'elemento "add-cart"
        const minusButton = menuElement.querySelector(".minus");
        const plusButton = menuElement.querySelector(".plus");
        const addCartButton = menuElement.querySelector("#add-cart");
        const quantityInput = menuElement.querySelector(
          "input#quantity_" + menuId
        );

        minusButton.addEventListener("click", function () {
          // Verifica se la quantità è maggiore di 0 prima di ridurla
          if (parseInt(quantityInput.value, 10) > 0) {
            // Riduci la quantità, assicurandoti che non scenda al di sotto del minimo
            quantityInput.value = Math.max(
              parseInt(quantityInput.value, 10) - 1,
              0
            );

            // Aggiorna la variabile prezzoIniziale specifica per questo ID
            prezzoInizialeMap[menuId] = calculateUpdatedPrice(
              prezzoInizialeMap[menuId],
              oggetto.price,
              -1
            );
          } else {
            console.log(
              "La quantità è già 0, impossibile ridurre ulteriormente."
            );
            toastr.warning(
              "La quantità è già 0. Impossibile ridurre ulteriormente."
            );
          }
        });

        plusButton.addEventListener("click", function () {
          // Aumenta la quantità, assicurandoti che non superi il massimo
          quantityInput.value = Math.min(
            parseInt(quantityInput.value, 10) + 1,
            100
          );

          // Aggiorna la variabile prezzoIniziale specifica per questo ID
          prezzoInizialeMap[menuId] = calculateUpdatedPrice(
            prezzoInizialeMap[menuId],
            oggetto.price,
            1
          );

          // Visualizza il prezzoIniziale nel log
          console.log(
            `Prezzo Iniziale per ${menuId} (dopo click su plus):`,
            prezzoInizialeMap[menuId]
          );
        });

        // Aggiungi l'event listener all'elemento "add-cart" solo se è stato trovato
        if (addCartButton) {
          addCartButton.addEventListener("click", function (event) {
            // Previeni il comportamento di default del link
            event.preventDefault();

            // Ottieni il riferimento al bottone "check-out"
            var checkoutButton = document.getElementById("check-out");

            // Toggle della classe opacity-50 sul div del bottone "check-out"
            checkoutButton.classList.add("opacity-50");

            // Seleziona l'elemento input per l'oggetto corrente
            const inputId = `input_${menuId}`;
            const noteInput = document.getElementById(inputId);

            // Verifica se la quantità è maggiore di 0 prima di procedere con l'aggiunta al carrello
            if (parseInt(quantityInput.value, 10) > 0) {
              // Salva le informazioni desiderate come variabili globali
              globalPrice = Math.max(prezzoInizialeMap[menuId], 0);
              globalQuantity = Math.max(parseInt(quantityInput.value, 10), 0);
              globalImage = oggetto.img;
              globalName = oggetto.name;
              globalID = menuId;

              // Ottieni il valore dall'input solo se la lunghezza è maggiore di 0
              if (noteInput && noteInput.value.trim().length > 0) {
                globalNote = noteInput.value.trim();
              } else {
                globalNote = ""; // Imposta globalNote a una stringa vuota se la lunghezza è 0
              }

              // Chiama la funzione per salvare le variabili globali
              saveGlobalVariables();

              // Chiama la funzione per generare l'HTML dinamico
              generateDynamicHTML();
              toastr.success(
                "Prodotto aggiunto con successo al carrello!",
                "Successo"
              );
            } else {
              console.log(
                "Impossibile aggiungere al riepilogo. La quantità è 0."
              );
              toastr.error("Impossibile aggiungere prodotto: la quantità è 0.");
              // Aggiungi qui il codice per visualizzare un toast con l'avviso
              // Ad esempio, usando una libreria di toast come Toastify o simile
            }
            // Resetta i valori di minus e plus a 1
            quantityInput.value = 1;
            var minusInput = menuElement.querySelector(
              "input#quantity_" + menuId
            );
            var plusInput = menuElement.querySelector(
              "input#quantity_" + menuId
            );
            minusInput.value = 1;
            plusInput.value = 1;
            // Reimposta la variabile che tiene traccia del totale al suo valore iniziale
            prezzoInizialeMap[menuId] = parseFloat(oggetto.price) || 0;
            // Log del valore aggiornato di prezzoInizialeMap[menuId]
            console.log(
              "Valore aggiornato di prezzoInizialeMap[" + menuId + "]:",
              prezzoInizialeMap[menuId]
            );
          });
        }

        // Aggiungi l'elemento del menu al container
        containerMenu.appendChild(menuElement);
      }
    }

    function editInput(menuId) {
      // Costruisci l'id dell'input
      const inputId = `input_${menuId}`;

      // Seleziona l'elemento input
      const inputElement = document.getElementById(inputId);

      // Verifica se l'elemento input esiste
      if (inputElement) {
        // Aggiungi un listener per il click sull'input
        inputElement.addEventListener("click", function () {
          console.log(`Input con id ${inputId} cliccato.`);

          // Salva il valore dell'input nella variabile globale
          globalNote = inputElement.value;
        });

        // Imposta il focus sull'input per attivare la modalità di modifica
        inputElement.focus();
      } else {
        console.error(`Elemento input con id ${inputId} non trovato.`);
      }
    }

    // Funzione per salvare le variabili globali
    function saveGlobalVariables() {
      // Puoi fare quello che vuoi con le variabili globali qui
      // Ad esempio, puoi inviarle a un'altra funzione o eseguire altre operazioni
      console.log("Global Price:", globalPrice);
      console.log("Global Quantity:", globalQuantity);
      console.log("Global Image:", globalImage);
      console.log("Global Name:", globalName);
      console.log("Global ID:", globalID);
      console.log("Global Note:", globalNote);
    }

    // Funzione per calcolare il prezzo aggiornato in base all'incremento o decremento
    function calculateUpdatedPrice(currentPrice, unitPrice, increment) {
      return currentPrice + parseFloat(unitPrice) * increment || 0;
    }
  }

  // Your array of categories menu laterale
  const categories = [
    "Cucina",
    "Menu Birra",
    "Menu Bibita",
    "Panini Singoli",
    "Pizza",
    "Bevande",
  ];

  console.log("Array di categorie:", categories);

  // Get the container element
  const categoryListContainer = document.getElementById("category-list");

  // Seleziona la prima categoria come inizialmente selezionata
  let primaCategoria = true;

  // Loop through the categories and create elements
  categories.forEach((category) => {
    // Replace spaces with underscores in category IDs and names
    const categoryId = category.toLowerCase().replace(/\s+/g, "_");
    const categoryName = category.toLowerCase().replace(/\s+/g, "_");

    // Create a new div element
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "flex items-center";

    // Create an input element
    const inputElement = document.createElement("input");
    inputElement.className =
      "form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer";
    inputElement.id = categoryId;
    inputElement.name = categoryName; // Corretto da categoryId a categoryName
    inputElement.type = "checkbox";
    inputElement.checked = primaCategoria; // Imposta il check sulla prima categoria
    primaCategoria = false;

    // Create a label element
    const labelElement = document.createElement("label");
    labelElement.className =
      "ps-3 inline-flex items-center text-default-600 text-lg select-none";
    labelElement.htmlFor = categoryId;
    labelElement.textContent = category;

    // Append the input and label elements to the category div
    categoryDiv.appendChild(inputElement);
    categoryDiv.appendChild(labelElement);

    // Aggiungi l'evento di click al div della categoria
    categoryDiv.addEventListener("click", categoriaClick);

    // Append the category div to the category list container
    categoryListContainer.appendChild(categoryDiv);
  });

  // Chiamata alla funzione per caricare i dati dal localStorage all'inizializzazione
  //loadFromLocalStorage();
}
