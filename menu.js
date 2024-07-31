document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll("button");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const parentDiv = button.parentNode;
      const itemName = parentDiv.querySelector("strong").textContent;
      const itemImage = parentDiv.querySelector("img").src;

      const item = {
        name: itemName,
        image: itemImage,
      };

      try {
        const cartItems = localStorage.getItem("cartItems");
        if (cartItems) {
          const existingItems = JSON.parse(cartItems);
          const existingItem = existingItems.find(
            (existingItem) => existingItem.name === itemName
          );
          if (existingItem) {
            existingItem.quantity++;
          } else {
            existingItems.push(item);
          }
          localStorage.setItem("cartItems", JSON.stringify(existingItems));
        } else {
          localStorage.setItem("cartItems", JSON.stringify([item]));
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }

      displayCartItems();
    });
  });

  function displayCartItems() {
    try {
      const cartItems = localStorage.getItem("cartItems");
      if (cartItems) {
        const aside = document.querySelector("aside");
        aside.innerHTML = "";
        const existingItems = JSON.parse(cartItems);
        existingItems.forEach((item) => {
          const cartItem = document.createElement("div");
          cartItem.innerHTML = `
            <img src="${item.image}" width="50" height="50">
            <span>${item.name}</span>
            <span>Quantity: ${
              existingItems.filter(
                (existingItem) => existingItem.name === item.name
              ).length
            }</span>
            <button class="remove-item">Remove</button>
          `;
          aside.appendChild(cartItem);

          // Add event listener to remove button
          const removeButton = cartItem.querySelector(".remove-item");
          removeButton.addEventListener("click", () => {
            // Remove item from local storage
            const updatedItems = existingItems.filter(
              (existingItem) => existingItem.name !== item.name
            );
            localStorage.setItem("cartItems", JSON.stringify(updatedItems));
            displayCartItems();
          });
        });

        // Add submit order button
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Order";
        submitButton.style.marginTop = "32px";

        // Only add submit button if cart is not empty
        if (existingItems.length > 0) {
          aside.appendChild(submitButton);

          // Add event listener to submit button
          submitButton.addEventListener("click", () => {
            // Display order confirmation message
            alert("Order submitted successfully!");

            // Remove items from cart
            localStorage.removeItem("cartItems");
            aside.innerHTML = "";
          });
        }
      }
    } catch (error) {
      console.error("Error displaying cart items:", error);
    }
  }

  displayCartItems();
});
