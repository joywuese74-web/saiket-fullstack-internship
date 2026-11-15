// ===== Add to Cart =====

// 1. Grab what we need
const cartCount = document.getElementById("cartCount");
const addButtons = document.querySelectorAll(".add-to-cart");
const toast = document.getElementById("cartToast");
const toastText = document.getElementById("toastText");

let count = 0;          // how many items are in the cart
let toastTimer;         // remembers the timer so we can reset it

// 2. Show the pop-up message for 2.5 seconds
function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);                 // restart the timer if clicked again quickly
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// 3. Give every "Add to Cart" button the same behaviour
addButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Increase the counter
    count++;
    cartCount.textContent = count;

    // Make the counter bounce (remove and re-add the class to replay the animation)
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;             // forces the browser to restart the animation
    cartCount.classList.add("bump");

    // Show which product was added
    const productName = button.dataset.name;
    showToast(productName + " added to cart");

    // Briefly change the button to show it worked
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check2"></i> Added';
    button.classList.add("added");
    button.disabled = true;                 // stops double-clicking

    setTimeout(function () {
      button.innerHTML = originalHTML;
      button.classList.remove("added");
      button.disabled = false;
    }, 1200);
  });
});