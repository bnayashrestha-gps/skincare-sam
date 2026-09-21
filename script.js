const form = document.getElementById("quoteForm");
const whatsappBtn = document.getElementById("whatsappBtn");
const emailBtn = document.getElementById("emailBtn");
const formMessage = document.getElementById("formMessage");

function getData() {
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name.trim() || !data.phone.trim()) {
    formMessage.textContent = "Please enter your full name and phone number.";
    return null;
  }
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

whatsappBtn.addEventListener("click", () => {
  const data = getData();
  if (!data) return;
  const message = encodeURIComponent(requestText(data));
  window.open(`https://wa.me/61452403408?text=${message}`, "_blank", "noopener");
  formMessage.textContent = "WhatsApp request prepared.";
});

emailBtn.addEventListener("click", () => {
  const data = getData();
  if (!data) return;
  const subject = encodeURIComponent(`Skincare Quote Request - ${data.name}`);
  const body = encodeURIComponent(requestText(data));
  window.location.href = `mailto:karishmapun21@gmail.com?subject=${subject}&body=${body}`;
  formMessage.textContent = "Email request prepared in your email app.";
});
