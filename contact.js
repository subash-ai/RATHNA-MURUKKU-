// Contact form: send message via mailto and WhatsApp fallback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const subject = `Order/Inquiry from ${name || 'Customer'}`;
    const body = `${message}\n\nName: ${name}\nPhone: ${phone}`;
    const mailto = `mailto:orders@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Open mail client
    window.location.href = mailto;
    // Also open WhatsApp draft in a new tab
    const wa = `https://wa.me/8754127143?text=${encodeURIComponent(message + '\n' + 'Name: ' + name + '\nPhone: ' + phone)}`;
    window.open(wa, '_blank');
  });
}
