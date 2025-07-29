const textInput = document.getElementById("textInput");
const animationSelect = document.getElementById("animationSelect");
const bgColorInput = document.getElementById("bgColor");
const bgImageInput = document.getElementById("bgImageInput");
const generateBtn = document.getElementById("generateBtn");
const startVideoBtn = document.getElementById("startVideoBtn");
const stopVideoBtn = document.getElementById("stopVideoBtn");
const previewArea = document.getElementById("previewArea");

let capturer;
let animationDuration = 2000; // ms per animation cycle
let framesPerSecond = 30;
let recording = false;

function clearPreview() {
  previewArea.innerHTML = "";
  previewArea.style.backgroundImage = "";
}

function createAnimatedText(text, animation) {
  const div = document.createElement("div");
  div.className = `animated-text animate__animated animate__${animation}`;
  div.innerText = text;
  return div;
}

function setBackgroundColor(color) {
  previewArea.style.backgroundColor = color;
}

function setBackgroundImage(file) {
  if (!file) {
    previewArea.style.backgroundImage = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    previewArea.style.backgroundImage = `url(${e.target.result})`;
    previewArea.style.backgroundSize = "cover";
    previewArea.style.backgroundPosition = "center";
  };
  reader.readAsDataURL(file);
}

generateBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text.");
    return;
  }
  clearPreview();
  setBackgroundColor(bgColorInput.value);
  if (bgImageInput.files[0]) {
    setBackgroundImage(bgImageInput.files[0]);
  }
  const animatedText = createAnimatedText(text, animationSelect.value);
  previewArea.appendChild(animatedText);
});

startVideoBtn.addEventListener("click", () => {
  if (recording) {
    alert("Recording already in progress.");
    return;
  }
  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text before recording.");
    return;
  }

  clearPreview();
  setBackgroundColor(bgColorInput.value);
  if (bgImageInput.files[0]) {
    setBackgroundImage(bgImageInput.files[0]);
  }

  // Start recording
  capturer = new CCapture({
    format: "webm",
    framerate: framesPerSecond,
    verbose: true,
  });

  const animatedText = createAnimatedText(text, animationSelect.value);
  previewArea.appendChild(animatedText);

  recording = true;
  startVideoBtn.disabled = true;
  stopVideoBtn.disabled = false;

  capturer.start();

  let elapsed = 0;
  const interval = 1000 / framesPerSecond;

  function animateAndCapture() {
    if (!recording) return;

    // Restart animation by removing & adding animation class
    animatedText.classList.remove(`animate__${animationSelect.value}`);
    void animatedText.offsetWidth; // trigger reflow
    animatedText.classList.add(`animate__${animationSelect.value}`);

    html2canvas(previewArea, { backgroundColor: null }).then((canvas) => {
      capturer.capture(canvas);
    });

    elapsed += interval;
    if (elapsed < animationDuration) {
      setTimeout(animateAndCapture, interval);
    } else {
      stopVideoBtn.click(); // auto stop after animationDuration
    }
  }

  animateAndCapture();
});

stopVideoBtn.addEventListener("click", () => {
  if (!recording) {
    alert("No recording in progress.");
    return;
  }
  recording = false;
  capturer.stop();
  capturer.save();
  startVideoBtn.disabled = false;
  stopVideoBtn.disabled = true;
});