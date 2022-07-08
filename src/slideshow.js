// const slideshowIntervalSeconds = 5;
const slideshowIntervalSeconds = 60;

const slideshow = window.location.pathname === "/slideshow.html";

if (slideshow) {
  setTimeout(nextSlide, slideshowIntervalSeconds * 1000);
}

function nextSlide() {
  window.location.reload();
}

// const cancel = (event) => {
//   event.stopPropagation();
//   event.preventDefault();
// };

// window.addEventListener("keydown", cancel);
// window.addEventListener("keyup", cancel);
// window.addEventListener("keypress", cancel);
