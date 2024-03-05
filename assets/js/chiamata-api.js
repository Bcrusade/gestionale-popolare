// Funzione principale che viene eseguita una volta che il DOM è pronto
document.addEventListener("DOMContentLoaded", function () {
  // URL dell'API da cui ottenere i dati JSON
  const apiUrl = "https://dev-c66hrfvbn433u4q.api.raw-labs.com/mock/json-api";

  // Carica i dati JSON dall'API e avvia l'applicazione
  loadExternalJsonAndInitialize(apiUrl);
});

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
let numeroOrdineIncrementale = 1;
// Dichiarazione dell'array al di fuori della funzione
let itemsArray = [];
// Variabile globale per la somma totale
let totalSum = [];

// Modifica la funzione loadExternalJsonAndInitialize per utilizzare la chiamata API
async function loadExternalJsonAndInitialize(apiUrl) {
  try {
    const response = await fetch(apiUrl); // Esegui la chiamata API
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

// Funzione per inizializzare l'applicazione con il JSON (Lista prodotti) fornito
function initializeApp(json) {
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

  // Mappa delle categorie ai rispettivi array di menu
  const categorieMenuMap = {
    cucina: json["cucina"],
    menu_birra: json["menu birra"],
    menu_bibita: json["menu bibita"],
    panini_singoli: json["panini"],
    pizza: json["pizza"],
    bevande: json["bevande"],
  };

  // Aggiungi l'evento di click all'elemento con ID "check-out"
  const checkoutButton = document.getElementById("check-out");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", saveValuesOnCheckout);
  }

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
          <h4 class="text-sm text-default-600 mb-2 font-bold">${objectDetails.name}</h4>
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

    // Aggiungere il valore corrente alla somma totale
    grandTotal += totalPriceSum;

    // Aggiungere il valore corrente alla lista dei totali
    totalPriceList.push(totalPriceSum);

    // Ora puoi utilizzare la variabile totalPriceSum per ottenere la somma totale dei prezzi
    console.log("Somma totale dei prezzi di questa chiamata:", totalPriceSum);

    // Calcolare la somma totale di tutti i valori nella lista
    grandTotal = totalPriceList.reduce(
      (acc, currentTotal) => acc + currentTotal,
      0
    );

    // Selezionare l'elemento <p> con l'ID "Totale"
    const totaleElement = document.getElementById("Totale");

    // Aggiornare il contenuto dell'elemento con la somma totale
    totaleElement.textContent = `€ ${grandTotal.toFixed(2)}`;

    console.log("Totale riepilog:", grandTotal);

    // Aggiungere la funzione di eliminazione
    function deleteObject(index) {
      // Selezionare il div padre da rimuovere
      const container = document.getElementById("container-riepilogo");
      const divToRemove = document.getElementById(objectDetailsArray[index].ID);

      // Log per il debugging
      console.log("Elemento da rimuovere:", divToRemove);

      // Verificare che l'elemento da rimuovere sia un figlio diretto del contenitore
      if (divToRemove && divToRemove.parentNode === container) {
        // Rimuovere l'elemento corrispondente dall'array di dettagli dell'oggetto
        const removedObjectPrice = parseFloat(objectDetailsArray[index].price);
        objectDetailsArray.splice(index, 1);

        // Rimuovere il div dal DOM
        container.removeChild(divToRemove);

        // Sottrarre il prezzo dell'oggetto eliminato dalla somma totale
        grandTotal -= removedObjectPrice;

        // Aggiornare il contenuto dell'elemento con la nuova somma totale
        totaleElement.textContent = `€ ${grandTotal.toFixed(2)}`;

        console.log("Totale aggiornato dopo l'eliminazione:", grandTotal);

        // Aggiornare totalPriceSum sottraendo il prezzo dell'oggetto eliminato
        totalPriceSum -= removedObjectPrice;

        console.log("Totale riepilogo aggiornato:", totalPriceSum);
      } else {
        // Log se l'elemento non è stato trovato o non è un figlio diretto del contenitore
        console.error(
          "Errore: Elemento non trovato o non è un figlio diretto del contenitore."
        );
      }
    }
  }
  // Funzione per salvare i valori
  function saveValuesOnCheckout() {
    if (grandTotal !== 0) {
      const currentItem = {
        gust: GuestTypeSelectedInput,
        order: numeroOrdineIncrementale,
        total: grandTotal,
      };
      numeroOrdineIncrementale++;
      itemsArray.push(currentItem);
      // Richiama la funzione per salvare i dati nel localStorage
      saveToLocalStorage();
      // Richiama la funzione per calcolare e salvare la somma totale
      calculateAndSaveTotalSum();

      console.log("Valori salvati con successo:", currentItem);
      toastr.success("Prodotto aggiunto con successo al carrello!", "Successo");
    } else {
      console.error("Errore: Almeno uno dei valori da salvare è undefined.");
      toastr.error("Aggiungi almeno un prodotto a carrello!", "Errore");
    }
  }
  // Funzione per caricare i dati dal localStorage
  function loadFromLocalStorage() {
    // Carica l'array
    const storedItemsArray = localStorage.getItem("itemsArray");
    itemsArray = storedItemsArray ? JSON.parse(storedItemsArray) : [];

    // Carica la somma totale
    const storedTotalSum = localStorage.getItem("totalSum");
    totalSum = storedTotalSum ? parseInt(storedTotalSum, 10) : 0;
  }

  // Funzione per salvare i dati nel localStorage
  function saveToLocalStorage() {
    localStorage.setItem("itemsArray", JSON.stringify(itemsArray));
    localStorage.setItem("totalSum", totalSum.toString());
  }

  // Funzione per calcolare e salvare la somma totale
  function calculateAndSaveTotalSum() {
    totalSum = itemsArray.reduce(
      (sum, currentItem) => sum + currentItem.total,
      0
    );
    saveToLocalStorage();
    console.log("Somma totale calcolata e salvata:", totalSum);
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
              <input id="input_${menuId}" type="text" placeholder="Inserisci modifiche" class="border-none h-3 w-full truncate overflow-auto" />
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
            } else {
              console.log(
                "Impossibile aggiungere al riepilogo. La quantità è 0."
              );
              toastr.error("Impossibile aggiungere prodotto: la quantità è 0.");
              // Aggiungi qui il codice per visualizzare un toast con l'avviso
              // Ad esempio, usando una libreria di toast come Toastify o simile
            }
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

  // Aggiungi l'evento di caricamento della pagina per caricare i dati dal localStorage
  window.addEventListener("load", loadFromLocalStorage);

  // Aggiungi l'evento di scaricamento della pagina per salvare i dati nel localStorage
  window.addEventListener("beforeunload", saveToLocalStorage);

  // Aggiungi l'evento di scaricamento della pagina per salvare i dati nel localStorage
  window.addEventListener("unload", function () {
    saveToLocalStorage();
  });
}
