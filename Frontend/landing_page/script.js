 const textEl = document.getElementById("typing-text");
const sound = document.getElementById("type-sound");
const text = textEl.innerText;
textEl.innerText = ""; // clear text for typing effect
let i = 0;

function type() {
  if (i < text.length) {
    textEl.innerText += text.charAt(i);

    // Play typing sound
    sound.currentTime = 0;  // reset sound to start
    sound.play().catch(e => console.log(e)); // ignore errors if audio can't play yet

    i++;
    setTimeout(type, 50); // typing speed in ms
  }
}

// Start typing on page load
window.addEventListener("load", type);
