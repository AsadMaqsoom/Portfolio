document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('contact-submit');
  const alertBox = document.getElementById('contact-alert');
  
  // Disable button to prevent multiple clicks
  submitBtn.disabled = true;
  submitBtn.innerText = 'Sending...';

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alertBox.className = "mt-5 text-sm px-4 py-3 rounded-xl border bg-green-500/10 border-green-500/20 text-green-400";
      alertBox.innerText = "Message sent successfully!";
      document.getElementById('contact-form').reset();
    } else {
      throw new Error('Failed to send');
    }
  } catch (error) {
    alertBox.className = "mt-5 text-sm px-4 py-3 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400";
    alertBox.innerText = "Something went wrong. Please try again.";
  } finally {
    alertBox.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.innerText = 'Send Message';
  }
});
