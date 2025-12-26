const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const PX = 2;

// 배경 이미지
const bgImg = new Image();
bgImg.src = "./cloud.png";

/*
 ❄️ 눈 결정 설계 철학
 - 중심 축
 - 6방향 가지
 - 각 가지 끝에 작은 분기
 - 픽셀 단위로만 그림
*/

class Snowflake {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -40;
    this.speed = 0.35 + Math.random() * 0.45;
    this.size = 4;              // 가지 길이 기준
    this.alpha = 0.95;
  }

  update() {
    this.y += this.speed;
    if (this.y > H + 30) this.reset();
  }

  draw() {
    const X = Math.floor(this.x / PX) * PX;
    const Y = Math.floor(this.y / PX) * PX;
    const p = PX;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ffffff";

    // 중심
    ctx.fillRect(X, Y, p, p);

    // 6방향 메인 가지
    const arms = [
      [ 0, -1], [ 0,  1],
      [-1,  0], [ 1,  0],
      [-1, -1], [ 1,  1]
    ];

    arms.forEach(([dx, dy]) => {
      for (let i = 1; i <= this.size; i++) {
        ctx.fillRect(X + dx * i * p, Y + dy * i * p, p, p);

        // 가지 끝에 작은 분기
        if (i === this.size) {
          ctx.fillRect(X + dx * i * p + dy * p, Y + dy * i * p + dx * p, p, p);
          ctx.fillRect(X + dx * i * p - dy * p, Y + dy * i * p - dx * p, p, p);
        }
      }
    });

    ctx.restore();
  }
}

// ❄️ 눈 개수 (존재감 위주)
const flakes = Array.from({ length: 22 }, () => new Snowflake());

function drawBackground() {
  if (bgImg.complete) {
    ctx.globalAlpha = 0.6;
    ctx.drawImage(bgImg, 0, 0, W, H);
    ctx.globalAlpha = 1;
  }

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
