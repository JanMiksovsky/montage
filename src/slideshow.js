const slideshowIntervalSeconds = 10;
// const slideshowIntervalSeconds = 60;
const fadeInDuration = 2;
const fadeOutDuration = 2;

const slideshow = window.location.pathname === "/slideshow.html";

function fadeTransitionEnd() {
  const fadingOut = !document.body.classList.contains("showContent");
  if (fadingOut) {
    nextSlide();
  }
}

function fadeIn() {
  document.body.classList.toggle("showContent", true);
}

function fadeOut() {
  document.body.classList.toggle("showContent", false);
}

function nextSlide() {
  const url = new URL(window.location.href);

  // Find the current aspect ratio of the element that will hold the collage.
  const collageGrid = document.getElementById("collageGrid");
  if (collageGrid) {
    const height = collageGrid.clientHeight;
    const width = collageGrid.clientWidth;
    const aspect = width / height;
    // Pass the aspect ratio to the collage generator as a search param.
    url.searchParams.set("aspect", encodeURIComponent(aspect));
  }

  window.location.href = url.href;
}

function pageLoad() {
  // Add durations to body style attribute.
  let bodyStyleAttribute = document.body.getAttribute("style") ?? "";
  bodyStyleAttribute += `; --fadeInDuration: ${fadeInDuration}s; --fadeOutDuration: ${fadeOutDuration}s;`;
  document.body.setAttribute("style", bodyStyleAttribute);

  fadeIn();
  if (slideshow) {
    const delayIntervalSeconds =
      slideshowIntervalSeconds - fadeInDuration - fadeOutDuration;
    setTimeout(fadeOut, delayIntervalSeconds * 1000);
  }
}

window.addEventListener("load", pageLoad);
document.body.addEventListener("transitionend", fadeTransitionEnd);
