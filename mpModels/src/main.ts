import './style.css'

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error("Missing app element");
app.innerHTML = `
<div>
  <canvas id="circleGame" width="800" height="600"></canvas>
  <button id="runButton">Start Game</button>
</div>
`
const canvas = document.querySelector<HTMLCanvasElement>("#circleGame");
if (!canvas) throw new Error("Missing game");
const ctx = canvas.getContext("2d")!;
if (!ctx) throw new Error("2D context not available");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let tick = 0;
const ballRadius = 10;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawText() {
  ctx.beginPath();
  ctx.fillText
}

function draw() {
  ctx.clearRect(0, 0, canvas!.width, canvas!.height);
  drawBall();

  if (x + dx > canvas!.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy > canvas!.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
  
  x += dx;
  y += dy;  

  requestAnimationFrame(draw);
}

function startGame() {
  draw();
}

const runButton = document.querySelector<HTMLButtonElement>("#runButton");
if (!runButton) throw new Error("Missing run button");
runButton.addEventListener("click", () => {
  console.log("click");
  startGame();
  runButton.disabled = true;
});
