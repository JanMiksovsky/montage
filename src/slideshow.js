const slideshowIntervalSeconds = 10;
// const slideshowIntervalSeconds = 60;
const transitionIntervalSeconds = 2;

const slideshow = window.location.pathname === "/slideshow.html";

function fadeTransitionEnd() {
  const fadingOut = !document.body.classList.contains("showContent");
  if (fadingOut) {
    nextSlide();
  }
}

function fadeIn() {
  console.log("fadeIn");
  document.body.classList.toggle("showContent", true);
}

function fadeOut() {
  console.log("fadeOut");
  document.body.classList.toggle("showContent", false);
}

function nextSlide() {
  window.location.reload();
}

function pageLoad() {
  fadeIn();
  if (slideshow) {
    const delayIntervalSeconds =
      slideshowIntervalSeconds - transitionIntervalSeconds;
    setTimeout(fadeOut, delayIntervalSeconds * 1000);
  }
}

window.addEventListener("load", pageLoad);
document.body.addEventListener("transitionend", fadeTransitionEnd);
