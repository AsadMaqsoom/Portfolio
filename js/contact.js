document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullName: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      subscribeToNewsletter: document.getElementById("newsletter").checked
    };

    const targetEmail = "asad.maqsoom@outlook.com";
    const subject = encodeURIComponent(payload.subject || `Portfolio inquiry from ${payload.fullName || "Website Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${payload.fullName}\nEmail: ${payload.email}\nNewsletter: ${payload.subscribeToNewsletter ? "Yes" : "No"}\n\nMessage:\n${payload.message}`
    );

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  });
});
