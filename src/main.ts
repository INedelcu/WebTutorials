import './style.css';
import { clamp, type Vec2 } from './math';

const canvas = document.querySelector<HTMLCanvasElement>('#view')!;
const statusText = document.querySelector<HTMLSpanElement>('#status')!;
const ctx = canvas.getContext('2d')!;

// A square you can drag around, in CSS pixels.
class Square {
  constructor(
    public position: Vec2, // top-left corner
    readonly size: number,
    readonly color: string,
  ) {}

  contains(p: Vec2): boolean {
    const { x, y } = this.position;
    return p.x >= x && p.x <= x + this.size && p.y >= y && p.y <= y + this.size;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean) {
    ctx.beginPath();
    ctx.roundRect(this.position.x, this.position.y, this.size, this.size, 8);
    ctx.fillStyle = this.color;
    ctx.fill();
    if (selected) {
      ctx.strokeStyle = '#ff9a1a';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}

const squares = [
  new Square({ x: 80, y: 80 }, 120, '#d94d40'),
  new Square({ x: 260, y: 140 }, 90, '#4d8ce6'),
  new Square({ x: 160, y: 260 }, 100, '#66cc73'),
];

let selected: Square | null = null;
let dragOffset: Vec2 = { x: 0, y: 0 }; // from the square's corner to the pointer

// The pointer position relative to the canvas, in CSS pixels.
function pointerPosition(e: PointerEvent): Vec2 {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener('pointerdown', (e) => {
  const p = pointerPosition(e);
  // Squares later in the list are drawn on top, so search from the end.
  selected = [...squares].reverse().find((s) => s.contains(p)) ?? null;
  if (selected) {
    squares.splice(squares.indexOf(selected), 1);
    squares.push(selected); // bring it to the front
    dragOffset = { x: p.x - selected.position.x, y: p.y - selected.position.y };
    canvas.setPointerCapture(e.pointerId); // keep getting moves even outside the canvas
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!selected || !canvas.hasPointerCapture(e.pointerId)) {
    return;
  }
  const p = pointerPosition(e);
  selected.position = {
    x: clamp(p.x - dragOffset.x, 0, canvas.clientWidth - selected.size),
    y: clamp(p.y - dragOffset.y, 0, canvas.clientHeight - selected.size),
  };
});

let frames = 0;
let last = performance.now();

// Called once per display refresh by requestAnimationFrame.
function frame(now: number) {
  // Match the canvas resolution to its size on screen, in physical pixels.
  const width = Math.floor(canvas.clientWidth * devicePixelRatio);
  const height = Math.floor(canvas.clientHeight * devicePixelRatio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // Draw in CSS pixels; the transform scales them up to physical pixels.
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.fillStyle = '#1f2024';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for (const square of squares) {
    square.draw(ctx, square === selected);
  }

  // Twice a second, show the frame rate.
  frames++;
  if (now - last >= 500) {
    statusText.textContent = `${Math.round((frames * 1000) / (now - last))} fps · Drag the squares`;
    frames = 0;
    last = now;
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);