import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="circleGame" width="640" height="480"></canvas>
  </div>
`
function draw() {
  const canvas = document.getElementById("circleGame");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgb(200 0, 0)";
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = "rgb(0 0 200 / 50%)";
  ctx.fillRect(30, 30, 50, 50)
}

draw();

