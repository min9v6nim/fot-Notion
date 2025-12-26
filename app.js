const grid = document.getElementById("grid");
const title = document.getElementById("monthTitle");

let view = new Date();

/* =========================
   🇰🇷 한국 공휴일 (2025~2027)
========================= */
const holidays = {
  // 2025
  "2025-01-01": true,
  "2025-01-28": true,
  "2025-01-29": true,
  "2025-01-30": true,
  "2025-03-01": true,
  "2025-05-01": true,
  "2025-05-05": true,
  "2025-06-06": true,
  "2025-08-15": true,
  "2025-10-03": true,
  "2025-10-06": true,
  "2025-10-07": true,
  "2025-10-08": true,
  "2025-10-09": true,
  "2025-12-25": true,

  // 2026
  "2026-01-01": true,
  "2026-02-16": true,
  "2026-02-17": true,
  "2026-02-18": true,
  "2026-03-01": true,
  "2026-03-02": true,
  "2026-05-01": true,
  "2026-05-05": true,
  "2026-06-03": true,
  "2026-06-06": true,
  "2026-08-15": true,
  "2026-08-17": true,
  "2026-09-24": true,
  "2026-09-25": true,
  "2026-09-26": true,
  "2026-10-03": true,
  "2026-10-05": true,
  "2026-10-09": true,
  "2026-12-25": true,

  // 2027
  "2027-01-01": true,
  "2027-02-06": true,
  "2027-02-07": true,
  "2027-02-08": true,
  "2027-03-01": true,
  "2027-05-05": true,
  "2027-06-06": true,
  "2027-08-15": true,
  "2027-09-14": true,
  "2027-09-15": true,
  "2027-09-16": true,
  "2027-10-03": true,
  "2027-10-04": true,
  "2027-10-09": true,
  "2027-12-25": true
};

const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* =========================
   📅 캘린더 렌더
========================= */
function render() {
  const y = view.getFullYear();
  const m = view.getMonth();

  title.textContent = `${y}.${pad(m + 1)}`;
  grid.innerHTML = "";

  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const start = first.getDay();
  const total = last.getDate();

  const cells = [];

  // 이전 달
  const prevLast = new Date(y, m, 0).getDate();
  for (let i = 0; i < start; i++) {
    cells.push({ d: new Date(y, m - 1, prevLast - start + 1 + i), muted: true });
  }

  // 현재 달
  for (let d = 1; d <= total; d++) {
    cells.push({ d: new Date(y, m, d), muted: false });
  }

  // 다음 달
  while (cells.length < 42) {
    cells.push({
      d: new Date(y, m + 1, cells.length - total - start + 1),
      muted: true
    });
  }

  const today = new Date().toDateString();

  cells.forEach(({ d, muted }) => {
    const cell = document.createElement("div");
    cell.className = "day" + (muted ? " muted" : "");

    const dow = d.getDay();
    if (dow === 0) cell.classList.add("sun");
    if (dow === 6) cell.classList.add("sat");

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = d.getDate();
    cell.appendChild(num);

    const key = iso(d);

    // 공휴일 빨간 점
    if (holidays[key]) {
      cell.classList.add("holiday");
      const dot = document.createElement("div");
      dot.className = "holidayDot";
      cell.appendChild(dot);
    }

    if (d.toDateString() === today) {
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  });
}

/* =========================
   ⏮ ⏭ 버튼
========================= */
document.getElementById("prevBtn").onclick = () => {
  view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
  render();
};

document.getElementById("nextBtn").onclick = () => {
  view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  render();
};

document.getElementById("todayBtn").onclick = () => {
  view = new Date();
  render();
};

// 초기 실행
render();
