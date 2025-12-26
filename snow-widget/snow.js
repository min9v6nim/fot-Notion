const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const PX = 2;

// 구름 배경 (이미 있는 cloud.png)
const bgImg = new Image();
bgImg.src = "./cloud.png";

// 눈 결정 클래스
class Snowflake {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -40;
    this.speed = 0.5 + Math.random() * 0.6;
    this.size = 12;          // 🔴 크게
    this.alpha = 0.95;       // 🔴 선명
  }

  update() {
    this.y += this.speed;
    if (this.y > H + 20) this.reset();
  }

  draw() {
    const X = Math.floor(this.x / PX) * PX;
    const Y = Math.floor(this.y / PX) * PX;
    const p = PX;

    ctx.globalAlpha = this.alpha;

    // ❄️ 눈 결정 (십자 + 대각)
    ctx.fillStyle = "#ffd6e8";

    ctx.fillRect(X, Y, p, p);
    ctx.fillRect(X - p, Y, p, p);
    ctx.fillRect(X + p, Y, p, p);
    ctx.fillRect(X, Y - p, p, p);
    ctx.fillRect(X, Y + p, p, p);

    ctx.fillRect(X - p, Y - p, p, p);
    ctx.fillRect(X + p, Y - p, p, p);
    ctx.fillRect(X - p, Y + p, p, p);
    ctx.fillRect(X + p, Y + p, p, p);

    // 중앙 하이라이트
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(X, Y, p, p);

    ctx.globalAlpha = 1;
  }
}

const flakes = Array.from({ length: 36 }, () => new Snowflake());

function drawBackground() {
  if (bgImg.complete) {
    // 🔴 구름 배경 진하게
    ctx.globalAlpha = 0.6;
    ctx.drawImage(bgImg, 0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // 파스텔 필터
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 0, W, H);
}

function drawLabel() {
  ctx.save();
  ctx.font = "10px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("MY NOTION HOME", W / 2, H - 22);
  ctx.restore();
}

function loop() {
  ctx.clearRect(0, 0, W, H);

  drawBackground();

  flakes.forEach(f => {
    f.update();
    f.draw();
  });

  drawLabel();

  requestAnimationFrame(loop);
}

loop();
