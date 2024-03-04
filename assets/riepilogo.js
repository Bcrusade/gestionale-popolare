// // Function to generate HTML dynamically based on object details
// function generateDynamicHTML(objectDetailsArray) {
//   // Select the container where you want to append the HTML (replace 'container-id' with your actual container ID)
//   const container = document.getElementById("container");

//   // Clear the container before appending new content
//   container.innerHTML = "";

//   // Loop through the array of object details
//   objectDetailsArray.forEach((objectDetails) => {
//     // Create a new div for each object
//     const objectDiv = document.createElement("div");
//     objectDiv.className = "flex items-center mb-4";
//     objectDiv.innerHTML = `
//             <img src="${objectDetails.img}" class="h-20 w-20 me-2">
//             <div>
//                 <h4 class="text-sm text-default-600 mb-2">${objectDetails.name}</h4>
//                 <h4 class="text-sm text-default-400">${objectDetails.quantity} x <span class="text-primary font-semibold">${objectDetails.price}</span></h4>
//             </div>
//         `;

//     // Append the new div to the container
//     container.appendChild(objectDiv);
//   });
// }

// // Example usage with a hypothetical array of object details
// const objectDetailsArray = [
//   {
//     img: "assets/onion-rings-6902e6d8.png",
//     name: "Onion Rings",
//     quantity: 1,
//     price: "$29",
//   },
//   {
//     img: "assets/pizza.jpg",
//     name: "Margherita Pizza",
//     quantity: 2,
//     price: "$15.99",
//   },
//   // Add more object details as needed
// ];

// // Call the function to generate dynamic HTML
// generateDynamicHTML(objectDetailsArray);

// // Funzione per generare HTML dinamico basato sulle variabili globali
// function generateDynamicHTML() {
//   // Creare un array di dettagli dell'oggetto basato sulle variabili globali
//   const objectDetailsArray = [{
//     img: globalImage,
//     name: globalName,
//     quantity: globalQuantity,
//     price: globalPrice,
//   }];

//   // Selezionare il container in cui si desidera aggiungere l'HTML (sostituire 'container-id' con il tuo effettivo ID del container)
//   const container = document.getElementById("container");

//   // Pulire il container prima di aggiungere nuovo contenuto
//   container.innerHTML = "";

//   // Loop attraverso l'array di dettagli dell'oggetto
//   objectDetailsArray.forEach((objectDetails) => {
//     // Creare un nuovo div per ogni oggetto
//     const objectDiv = document.createElement("div");
//     objectDiv.className = "flex items-center mb-4";
//     objectDiv.innerHTML = `
//       <img src="${objectDetails.img}" class="h-20 w-20 me-2">
//       <div>
//         <h4 class="text-sm text-default-600 mb-2">${objectDetails.name}</h4>
//         <h4 class="text-sm text-default-400">${objectDetails.quantity} x <span class="text-primary font-semibold">${objectDetails.price}</span></h4>
//       </div>
//     `;

//     // Aggiungere il nuovo div al container
//     container.appendChild(objectDiv);
//   });
// }
