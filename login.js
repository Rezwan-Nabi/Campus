const demoAccounts = {
  buyer: { email: "buyer@campus.edu", password: "Buyer2026!", label: "Buyer" },
  seller: { email: "seller@campus.edu", password: "Seller2026!", label: "Seller" },
  moderator: { email: "moderator@campus.edu", password: "Moderator2026!", label: "Moderator" },
  admin: { email: "admin@campus.edu", password: "Admin2026!", label: "Admin" }
};

const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#loginEmail");
const passwordInput = document.querySelector("#loginPassword");
const message = document.querySelector("#loginMessage");

function showMessage(text, type) {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

function getSavedAccounts() {
  try {
    return JSON.parse(localStorage.getItem("campusXchangeAccounts") || "[]");
  } catch (error) {
    console.error("Unable to read saved accounts.", error);
    return [];
  }
}

function setDemoAccount(role) {
  const account = demoAccounts[role];
  if (!account) return;
  emailInput.value = account.email;
  passwordInput.value = account.password;
  showMessage(`${account.label} demo credentials loaded.`, "success");
  emailInput.focus();
}

document.querySelectorAll("[data-demo-role]").forEach((button) => {
  button.addEventListener("click", () => setDemoAccount(button.dataset.demoRole));
});

document.querySelector("#togglePassword").addEventListener("click", (event) => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  event.currentTarget.textContent = showing ? "Show" : "Hide";
  event.currentTarget.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

document.querySelector("#forgotPassword").addEventListener("click", () => {
  showMessage("Password recovery is not connected yet. Please use a demo account or register again.", "error");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "form-message";

  if (!form.checkValidity()) {
    form.reportValidity();
    showMessage("Enter a valid email address and password.", "error");
    return;
  }

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const savedAccount = getSavedAccounts().find((account) => account.email === email && account.password === password);
  const demoRole = Object.keys(demoAccounts).find((role) => demoAccounts[role].email === email && demoAccounts[role].password === password);
  const account = savedAccount || (demoRole ? { ...demoAccounts[demoRole], role: demoRole } : null);

  if (!account) {
    showMessage("The email or password is incorrect. Try a demo account below.", "error");
    return;
  }

  const role = account.role || demoRole || "buyer";
  const session = { name: account.name || account.label, email, role, signedInAt: new Date().toISOString() };
  const storage = document.querySelector("#rememberMe").checked ? localStorage : sessionStorage;
  storage.setItem("campusXchangeSession", JSON.stringify(session));
  window.location.href = `index.html?role=${encodeURIComponent(role)}`;
});
