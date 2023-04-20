const form = document.querySelector('.contact-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const data = { name, email, message };
  console.log(data);

  form.reset();
});

