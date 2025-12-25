const grid = document.getElementById("grid");
const title = document.getElementById("monthTitle");

const NOTION_CAL_URL =
  "https://www.notion.so/2d4220d08fb680738493c8cf153691c7?v=2d4220d08fb68015b398000c2ec8833f";

let view = new Date();

// ===== 2026 KR holidays (요청 리스트) =====
// * 근로자의날은 비공휴일이지만 표기 요청 → 같이 표시
const holidays = {
  "2026-01-01": "신정",
  "2026-02-16": "설날",
  "2026-02-17": "설날",
  "2026-02-18": "설날",
  "2026-03-01": "삼일절",
  "2026-03-02": "대체공휴일",
  "2026-05-01": "근로자의날",
  "2026-05-05": "어린이날",
  "2026-05-24": "부처님오신날",
  "2026-05-25": "대체휴일",
  "2026-06-03": "지방선거",
  "2026-06-06": "현충일",
  "2026-08-15": "광복절",
  "2026-08-17": "대체공휴일",
  "2026-09-24": "추석",
  "2026-09-25": "추석",
  "2026-09-26": "추석",
  "2026-10-03": "개천절",
  "2026-10-05": "대체공휴일",
  "2026-10-09": "한글날",
  "2026-12-25": "성탄절"
};

const pad = (n) => String(n).padStart(2, "0");
const isoOf = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function render() {
  const y = view.getFullYear();
  const m = view.getMonth();

  title.textContent = `${y}.${pad(m + 1)}`;
  grid.innerHTML = "";

  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  // ✅ 핵심: 요일 정렬 (일=0, ... 토=6)
  const startDay = first.getDay();
  const totalDays = last.getDate();

  // 이전 달 마지막 날짜
  const prevLast = new Date(y, m, 0).getDate();

  // 42칸(6주) 고정
  const cells = [];

  // prev month cells
  for (let i = 0; i < startDay; i++) {
    const d = prevLast - startDay + 1 + i;
    cells.push({ date: new Date(y, m - 1, d), muted: true });
  }

  // current month cells
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ date: new Date(y, m, d), muted: false });
  }

  // next month cells
  while (cells.length < 42) {
    const nextDay = cells.length - (startDay + totalDays) + 1;
    cells.push({ date: new Date(y, m + 1, nextDay), muted: true });
  }

  // render cells
  const today = new Date();
  const todayStr = today.toDateString();

  cells.forEach(({ date, muted }) => {
    const cell = document.createElement("div");
    cell.className = "day" + (muted ? " muted" : "");

    // weekend classes based on 실제 요일
    const dow = date.getDay();
    if (dow === 0) cell.classList.add("sun");
    if (dow === 6) cell.classList.add("sat");

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = date.getDate();
    cell.appendChild(num);

    const iso = isoOf(date);
    if (holidays[iso]) {
      const lab = document.createElement("div");
      lab.className = "label";
      lab.textContent = holidays[iso];
      cell.appendChild(lab);
    }

    if (date.toDateString() === todayStr) {
      cell.classList.add("today");
    }

    // ✅ 특정 날짜 클릭 → 노션 캘린더 페이지로 이동
    // (Notion이 날짜 파라미터를 직접 받아서 해당 날짜로 점프하는 기능은 제한적이라
    //  우선은 "캘린더 페이지 오픈"이 가장 안정적임)
    cell.addEventListener("click", () => {
      window.open(NOTION_CAL_URL, "_blank");
    });

    grid.appendChild(cell);
  });
}

document.getElementById("prevBtn").addEventListener("click", () => {
  view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
  render();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  render();
});

document.getElementById("todayBtn").addEventListener("click", () => {
  view = new Date();
  render();
});

render();
