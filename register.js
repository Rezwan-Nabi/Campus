const roleConfig = {
  buyer: {
    title: "Create a buyer account",
    description: "Browse listings, message sellers, and track your campus purchases.",
    fields: "buyerFields",
    label: "Create buyer account",
    heading: "Buyer details"
  },
  seller: {
    title: "Create a seller account",
    description: "List textbooks, devices, and campus equipment for fellow students.",
    fields: "sellerFields",
    label: "Create seller account",
    heading: "Seller details"
  },
  moderator: {
    title: "Apply as a moderator",
    description: "Help verify listings and keep the campus marketplace safe.",
    fields: "moderatorFields",
    label: "Submit moderator application",
    heading: "Moderator details"
  },
  admin: {
    title: "Create an admin account",
    description: "Manage platform operations, users, and campus marketplace settings.",
    fields: "adminFields",
    label: "Create admin account",
    heading: "Administrator details"
  }
};

const form = document.querySelector("#registrationForm");
const roleInput = document.querySelector("#accountRole");
const message = document.querySelector("#formMessage");

function setRole(role) {
  const config = roleConfig[role] || roleConfig.buyer;
  roleInput.value = role;
  document.querySelector("#registrationTitle").textContent = config.title;
  document.querySelector("#registrationDescription").textContent = config.description;
  document.querySelector("#roleFieldsTitle").textContent = config.heading;
  document.querySelector(".registration-submit").textContent = config.label;
  document.querySelector("#registrationStep").textContent = `${Object.keys(roleConfig).indexOf(role) + 1} of 4 roles`;

  document.querySelectorAll(".registration-tab").forEach((tab) => {
    const active = tab.dataset.role === role;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".role-fields-content").forEach((fields) => {
    fields.hidden = fields.id !== config.fields;
    fields.querySelectorAll("input, select").forEach((control) => {
      control.disabled = fields.hidden;
    });
  });
  message.textContent = "";
  message.className = "form-message";
}

document.querySelectorAll(".registration-tab").forEach((tab) => {
  tab.addEventListener("click", () => setRole(tab.dataset.role));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "form-message";

  if (!form.checkValidity()) {
    form.reportValidity();
    message.textContent = "Please complete all required fields before continuing.";
    message.classList.add("error");
    return;
  }

  if (document.querySelector("#password").value !== document.querySelector("#confirmPassword").value) {
    message.textContent = "Passwords do not match.";
    message.classList.add("error");
    document.querySelector("#confirmPassword").focus();
    return;
  }

  const role = roleInput.value;
  const name = document.querySelector("#fullName").value.trim();
  const account = {
    name,
    email: document.querySelector("#email").value.trim().toLowerCase(),
    password: document.querySelector("#password").value,
    role
  };
  const accounts = JSON.parse(localStorage.getItem("campusXchangeAccounts") || "[]");
  const existingIndex = accounts.findIndex((savedAccount) => savedAccount.email === account.email);
  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem("campusXchangeAccounts", JSON.stringify(accounts));
  message.textContent = `Registration complete for ${name}. Your ${role} portal is ready.`;
  message.classList.add("success");
  form.reset();
  roleInput.value = role;
  setRole(role);
  message.textContent = `Registration complete for ${name}. Your ${role} portal is ready.`;
  message.classList.add("success");
});

const requestedRole = new URLSearchParams(window.location.search).get("role");
setRole(roleConfig[requestedRole] ? requestedRole : "buyer");
