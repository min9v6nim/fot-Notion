const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const PX = 2;

// 구름 배경 (진하게 사용)
const bgImg = new Image();
bgImg.src = "./cloud.png";

// 눈 결정 클래스
class Snowflake {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -20;
    this.speed = 0.3 + Math.random() * 0.4;
    this.size = 6;
    this.alpha = 0.8 + Math.random() * 0.2;
  }

  update() {
    this.y += this.speed;
    if (this.y > H + 10) this.reset();
  }

  draw() {
    const X = Math.floor(this.x / PX) * PX;
    const Y = Math.floor(this.y / PX) * PX;

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ffffff";

    /* ❄️ 눈 결정 모양 */
    const p = PX;
    ctx.fillRect(X, Y, p, p);
    ctx.fillRect(X - p, Y, p, p);
    ctx.fillRect(X + p, Y, p, p);
    ctx.fillRect(X, Y - p, p, p);
    ctx.fillRect(X, Y + p, p, p);

    ctx.fillRect(X - p, Y - p, p, p);
    ctx.fillRect(X + p, Y - p, p, p);
    ctx.fillRect(X - p, Y + p, p, p);
    ctx.fillRect(X + p, Y + p, p, p);

    ctx.globalAlpha = 1;
  }
}

const flakes = Array.from({ length: 28 }, () => new Snowflake());

function drawBackground() {
  if (bgImg.complete) {
    /* 🔴 요청 1: 구름 배경을 더 진하게 */
    ctx.globalAlpha = 0.55;
    ctx.drawImage(bgImg, 0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  /* 살짝 파스텔 필터 */
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 0, W, H);
}

function loop() {
  ctx.clearRect(0, 0, W, H);

  drawBackground();

  flakes.forEach(f => {
    f.update();
    f.draw();
  });

  requestAnimationFrame(loop);
}

loop();
