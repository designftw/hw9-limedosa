const participants = document.querySelectorAll(".participant");

participants.forEach((participant) => {
  participant.addEventListener("click", () => {
    participant.classList.toggle("active"); /* Toggle active class on click */
  });

  participant.addEventListener("mouseover", () => {
    participant.classList.add("active"); /* Add active class on hover */
  });

  participant.addEventListener("mouseout", () => {
    participant.classList.remove(
      "active"
    ); /* Remove active class on mouseout */
  });
});
