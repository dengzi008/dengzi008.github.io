const askBtn = document.getElementById("askBtn");
const coinStage = document.getElementById("coinStage");
const coin = document.getElementById("coin");
const resultText = document.getElementById("resultText");
const retryBtn = document.getElementById("retryBtn");

let spinning = false;

function resetState() {
  coin.classList.remove("spin", "fast-spin");
  resultText.textContent = "";
  retryBtn.classList.add("hidden");
}

function showButton() {
  askBtn.classList.remove("hidden");
  coinStage.classList.add("hidden");
  resetState();
}

function showCoin() {
  askBtn.classList.add("hidden");
  coinStage.classList.remove("hidden");
}

function startSpin() {
  if (spinning) return;
  spinning = true;
  resetState();
  showCoin();

  coin.classList.add("fast-spin");
  // keep fast spin briefly then transition to final spin
  setTimeout(() => {
    coin.classList.remove("fast-spin");
    coin.classList.add("spin");
  }, 600);

  const duration = Math.random() * 1000 + 2500; // 2.5s - 3.5s
  setTimeout(() => finishSpin(), duration);
}

function finishSpin() {
  // Decide front or back
  const isFront = Math.random() < 0.5;
  // Freeze spin by removing animation classes
  coin.classList.remove("fast-spin", "spin");
  coin.style.transform = `rotateY(${isFront ? 0 : 180}deg) rotateX(28deg)`;

  resultText.textContent = isFront ? "老天爷说可以干！" : "老天爷说别作死！";
  retryBtn.classList.remove("hidden");
  spinning = false;
}

askBtn.addEventListener("click", startSpin);
retryBtn.addEventListener("click", () => {
  showButton();
});

// 初始显示按钮
showButton();

