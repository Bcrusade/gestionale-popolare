// Funzione per salvare i dettagli dell'oggetto in formato JSON
function saveObjectDetails(objectId, quantity, objectName, initialPrice) {
  const details = {
    objectId: objectId,
    quantity: quantity,
    objectName: objectName,
    initialPrice: initialPrice,
  };

  // Converti l'oggetto in formato JSON
  const jsonDetails = JSON.stringify(details);

  // Visualizza il JSON generato nella console
  console.log("Dettagli dell'oggetto in formato JSON:", jsonDetails);

  // Ora puoi utilizzare il valore di jsonDetails come desideri, ad esempio inviarlo al server o salvarlo localmente
}

// Salva i dettagli dell'oggetto in formato JSON
saveObjectDetails(
  menuId,
  quantityInput.value,
  oggetto.name,
  prezzoInizialeMap[menuId]
);
