const form = document.getElementById("quoteForm");
const whatsappBtn = document.getElementById("whatsappBtn");
const emailBtn = document.getElementById("emailBtn");
const formMessage = document.getElementById("formMessage");
const successModal = document.getElementById("successModal");
const successClose = document.getElementById("successClose");

const EMAIL_TO = "karishmapun21@gmail.com";
const EMAIL_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL_TO}`;

function getData() {
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name.trim() || !data.phone.trim()) {
    formMessage.textContent = "Please enter your full name and phone number.";
    formMessage.classList.add("error");
    return null;
  }
  formMessage.textContent = "";
  formMessage.classList.remove("error");
  return data;
}

function requestText(data) {
  return [
    "Hi Karishma, I'd like to request a skincare quote.",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || "Not provided"}`,
    `Service: ${data.service || "Not specified"}`,
    `Preferred date: ${data.date || "Flexible"}`,
    `Preferred time: ${data.time || "Flexible"}`,
    `Message: ${data.message || "No additional details provided."}`
  ].join("\n");
}

function showSuccess() {
  successModal.classList.add("show");
  successModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  successClose.focus();
}

function hideSuccess() {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

whatsappBtn.addEventListener("click", () => {
  const data = getData();
  if (!data) return;
  const message = encodeURIComponent(requestText(data));
  window.open(`https://wa.me/61452403408?text=${message}`, "_blank", "noopener");
  formMessage.textContent = "WhatsApp request prepared.";
});

emailBtn.addEventListener("click", async () => {
  const data = getData();
  if (!data) return;

  const originalText = emailBtn.textContent;
  emailBtn.disabled = true;
  whatsappBtn.disabled = true;
  emailBtn.classList.add("is-loading");
  emailBtn.textContent = "Sending enquiry...";
  formMessage.textContent = "Sending your enquiry securely...";

  const payload = {
    name: data.name,
    phone: data.phone,
    email: data.email || "Not provided",
    service: data.service || "Not specified",
    preferred_date: data.date || "Flexible",
    preferred_time: data.time || "Flexible",
    message: data.message || "No additional details provided.",
    _subject: `Skincare Quote Request - ${data.name}`,
    _template: "table",
    _captcha: "false"
  };

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Unable to send enquiry.");
    }

    form.reset();
    formMessage.textContent = "";
    showSuccess();
  } catch (error) {
    formMessage.textContent = "Sorry, your enquiry could not be sent. Please try again or use WhatsApp.";
    formMessage.classList.add("error");
  } finally {
    emailBtn.disabled = false;
    whatsappBtn.disabled = false;
    emailBtn.classList.remove("is-loading");
    emailBtn.textContent = originalText;
  }
});

successClose.addEventListener("click", hideSuccess);
successModal.addEventListener("click", (event) => {
  if (event.target === successModal) hideSuccess();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && successModal.classList.contains("show")) hideSuccess();
});
