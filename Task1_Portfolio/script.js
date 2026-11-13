// ===== Contact form validation (only runs on contact.html) =====

// 1. Grab the form and its fields
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const successMsg = document.getElementById("successMsg");

// 2. Helpers to mark a field as wrong or right
function showError(input, errorId, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  document.getElementById(errorId).textContent = message;
}

function showSuccess(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}

// 3. Check if an email looks valid: something@something.something
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// 4. Run the checks when the form is submitted
//    (the "if" stops errors on pages that have no form)
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Name check
    if (name === "") {
      showError(nameInput, "nameError", "Please enter your name.");
      isValid = false;
    } else if (name.length < 2) {
      showError(nameInput, "nameError", "Name must be at least 2 characters.");
      isValid = false;
    } else {
      showSuccess(nameInput);
    }

    // Email check
    if (email === "") {
      showError(emailInput, "emailError", "Please enter your email.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "emailError", "Please enter a valid email address.");
      isValid = false;
    } else {
      showSuccess(emailInput);
    }

    // Message check
    if (message.length < 10) {
      showError(messageInput, "messageError", "Message must be at least 10 characters.");
      isValid = false;
    } else {
      showSuccess(messageInput);
    }

    // 5. If everything passed, show success and clear the form
    if (isValid) {
      successMsg.classList.remove("d-none");
      form.reset();
      [nameInput, emailInput, messageInput].forEach(function (input) {
        input.classList.remove("is-valid");
      });
      setTimeout(function () {
        successMsg.classList.add("d-none");
      }, 4000); // hide the message after 4 seconds
    } else {
      successMsg.classList.add("d-none");
    }
  });
}


// ===== Light/dark theme toggle (every page) =====
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement; // the <html> tag

// Show a moon in light mode (click for dark) and a sun in dark mode (click for light)
function updateThemeIcon() {
  const isLight = root.getAttribute("data-theme") === "light";
  themeToggle.innerHTML = isLight ? '<i class="bi bi-moon-stars"></i>' : '<i class="bi bi-sun"></i>';
}

if (themeToggle) {
  updateThemeIcon();

  themeToggle.addEventListener("click", function () {
    const isLight = root.getAttribute("data-theme") === "light";

    if (isLight) {
      root.removeAttribute("data-theme");          // back to dark
    } else {
      root.setAttribute("data-theme", "light");    // switch to light
    }

    // Remember the choice so other pages (and the next visit) use it too
    try {
      localStorage.setItem("theme", isLight ? "dark" : "light");
    } catch (e) {
      // Some browsers block storage (e.g. private mode). The toggle still works for this page.
    }

    updateThemeIcon();
  });
}


// ===== Back to top button (every page) =====
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  // Show the button only after scrolling down 300px
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  // Smoothly scroll back to the top when clicked
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
