// =====================================================
// 1. SHOPPING CART (works on every page)
//    Each product added is saved in localStorage as a list,
//    so the cart keeps its items when you change pages.
//    Example of what is saved:
//    [ { name: "Drone", price: 1500000, priceText: "₦1,500,000-5,000,000",
//        image: "images/p7.jpg", qty: 2 } ]
// =====================================================
const cartCount = document.getElementById("cartCount");
const cartItemsList = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const addButtons = document.querySelectorAll(".add-to-cart");
const toast = document.getElementById("cartToast");
const toastText = document.getElementById("toastText");

let toastTimer;   // remembers the timer so we can reset it

// Load the saved cart (an empty list if nothing is saved or storage is blocked)
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("jtechCartItems")) || [];
  } catch (e) {
    return [];
  }
}

// Save the cart so other pages can read it
function saveCart() {
  try {
    localStorage.setItem("jtechCartItems", JSON.stringify(cart));
  } catch (e) {
    // Storage blocked (e.g. private mode): the cart still works on this page.
  }
}

let cart = loadCart();

// Turn a number like 1500000 into "₦1,500,000"
function formatNaira(amount) {
  return "₦" + amount.toLocaleString("en-NG");
}

// Rebuild the cart panel and the counter from the cart list
function renderCart() {
  // Counter = total quantity of all items
  let totalQty = 0;
  let total = 0;
  cart.forEach(function (item) {
    totalQty += item.qty;
    total += item.price * item.qty;
  });
  cartCount.textContent = totalQty;

  // Show the "empty" message or the list
  const isEmpty = cart.length === 0;
  cartEmpty.classList.toggle("d-none", !isEmpty);
  cartFooter.classList.toggle("d-none", isEmpty);

  // Build one <li> per product
  cartItemsList.innerHTML = "";
  cart.forEach(function (item, index) {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div class="cart-item-info">' +
        '<p class="cart-item-name">' + item.name + '</p>' +
        '<p class="cart-item-price">' + item.priceText + '</p>' +
        '<div class="qty-controls">' +
          '<button type="button" data-action="decrease" data-index="' + index + '" aria-label="Decrease">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button type="button" data-action="increase" data-index="' + index + '" aria-label="Increase">+</button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="remove-item" data-action="remove" data-index="' + index + '" aria-label="Remove">' +
        '<i class="bi bi-trash"></i>' +
      '</button>';
    cartItemsList.appendChild(li);
  });

  cartTotal.textContent = formatNaira(total);
}

// Show the pop-up message for 2.5 seconds
function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);                 // restart the timer if clicked again quickly
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// Make the counter bounce
function bumpCounter() {
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;               // forces the browser to restart the animation
  cartCount.classList.add("bump");
}

// Give every "Add to Cart" button the same behaviour
addButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Read the product details from its card
    const card = button.closest(".product-card");
    const name = button.dataset.name;
    const image = card.querySelector("img").getAttribute("src");
    const priceEl = card.querySelector(".product-price");
    const priceText = priceEl.firstChild.textContent.trim();        // e.g. "₦32,000" or "₦15,000-300,000"
    const firstPrice = priceText.match(/[\d,]+/);                    // the first number in the text
    const price = firstPrice ? Number(firstPrice[0].replace(/,/g, "")) : 0;

    // Already in the cart? Add 1 to its quantity. Otherwise add it as a new item.
    const existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: name, price: price, priceText: priceText, image: image, qty: 1 });
    }

    saveCart();
    renderCart();
    bumpCounter();
    showToast(name + " added to cart");

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

// One listener for all +, − and remove buttons inside the cart list
// (this is called "event delegation", because the buttons are created by JavaScript)
cartItemsList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (action === "increase") {
    cart[index].qty++;
  } else if (action === "decrease") {
    cart[index].qty--;
    if (cart[index].qty === 0) {
      cart.splice(index, 1);                // remove the item when it reaches 0
    }
  } else if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
});

// Clear the whole cart
document.getElementById("clearCartBtn").addEventListener("click", function () {
  cart = [];
  saveCart();
  renderCart();
});

// Checkout: JTech is a demo shop, so just show a friendly message
document.getElementById("checkoutBtn").addEventListener("click", function () {
  showToast("This is a demo shop, so checkout isn't available.");
});

// Show the saved cart as soon as the page loads
renderCart();


// =====================================================
// 2. NEWSLETTER VALIDATION (only on index.html)
// =====================================================
const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {   // skip this part on pages without the newsletter
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMsg = document.getElementById("newsletterMsg");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showNewsletterMessage(text, type) {
    newsletterMsg.textContent = text;
    newsletterMsg.className = "newsletter-msg " + type;   // "error" or "success"
  }

  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();               // stop the page from reloading

    const email = newsletterEmail.value.trim();

    if (email === "") {
      showNewsletterMessage("Please enter your email address.", "error");
      newsletterForm.classList.add("error");
    } else if (!emailPattern.test(email)) {
      showNewsletterMessage("That email doesn't look right. Try something like name@gmail.com", "error");
      newsletterForm.classList.add("error");
    } else {
      showNewsletterMessage("🎉 Thanks! Your 10% discount code is on its way to " + email, "success");
      newsletterForm.classList.remove("error");
      newsletterForm.reset();
    }
  });

  // Remove the red outline as soon as the user starts typing again
  newsletterEmail.addEventListener("input", function () {
    newsletterForm.classList.remove("error");
    newsletterMsg.textContent = "";
  });
}


// =====================================================
// 3. CONTACT FORM VALIDATION (only on contact.html)
// =====================================================
const contactForm = document.getElementById("contactForm");

if (contactForm) {   // skip this part on pages without the contact form
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const contactSuccess = document.getElementById("contactSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Mark a field red with a message, or green if it's fine
  function setFieldError(input, errorId, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    document.getElementById(errorId).textContent = message;
  }
  function setFieldOk(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name.length < 2) {
      setFieldError(nameInput, "nameError", "Please enter your full name.");
      isValid = false;
    } else {
      setFieldOk(nameInput);
    }

    if (!emailPattern.test(email)) {
      setFieldError(emailInput, "emailError", "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldOk(emailInput);
    }

    if (message.length < 10) {
      setFieldError(messageInput, "messageError", "Message must be at least 10 characters.");
      isValid = false;
    } else {
      setFieldOk(messageInput);
    }

    if (isValid) {
      contactSuccess.classList.remove("d-none");
      contactForm.reset();
      [nameInput, emailInput, messageInput].forEach(function (input) {
        input.classList.remove("is-valid");
      });
      setTimeout(function () {
        contactSuccess.classList.add("d-none");
      }, 4000);
    } else {
      contactSuccess.classList.add("d-none");
    }
  });
}
