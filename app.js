// 캘린더 생성 + 노션 임베드용 최소 기능

let view = new Date(); // 현재 월 기준
const grid = document.getElementById("grid");
const monthTitle = document.getElementById("monthTitle");

function pad2(n){ return String(n).padStart(2,"0"); }

function render(){
  const y = view.getFullYear();
  const m = view.getMonth(); // 0-11
  monthTitle.textContent = `${y}-${pad2(m+1)}`;

  grid.innerHTML = "";

  const first = new Date(y, m, 1);
  const last = new Date(y, m+1, 0);
  const startDay = first.getDay(); // 0=Sun
  const daysInMonth = last.getDate();

  // 이전 달 채우기
  const prevLast = new Date(y, m, 0).getDate();
  for(let i=0;i<startDay;i++){
    const d = prevLast - (startDay-1-i);
    grid.appendChild(makeCell(y, m-1, d, true));
  }

  // 이번 달
  for(let d=1; d<=daysInMonth; d++){
    grid.appendChild(makeCell(y, m, d, false));
  }

  // 다음 달 채우기 (6주 고정 느낌)
  const totalCells = grid.children.length;
  const fill = (totalCells <= 35) ? (42 - totalCells) : (49 - totalCells);
  for(let i=1;i<=fill;i++){
    grid.appendChild(makeCell(y, m+1, i, true));
  }
}

function makeCell(y, m, d, muted){
  const date = new Date(y, m, d);
  const cell = document.createElement("div");
  cell.className = "day" + (muted ? " muted" : "");

  const n = document.createElement("div");
  n.className = "n";
  n.textContent = d;

  // 오늘 표시
  const today = new Date();
  if(date.toDateString() === today.toDateString()){
    cell.className += " today";
  }

  cell.appendChild(n);

  // 클릭 동작: 여기서 "노션 페이지 링크"로 연결 가능
  cell.addEventListener("click", () => {
    const iso = `${date.getFullYear()}-${pad2(date.getMonth()+1)}-${pad2(date.getDate())}`;

    // 1) 단순 알림
    // alert(iso);

    // 2) 특정 노션 URL로 이동 (원하면 아래 주석 해제 후 URL 교체)
    // const notionUrl = "https://www.notion.so/여기에-당신-노션-페이지-링크";
    // window.open(`${notionUrl}?d=${iso}`, "_blank");

    console.log("clicked:", iso);
  });

  return cell;
}

document.getElementById("prevBtn").addEventListener("click", () => {
  view = new Date(view.getFullYear(), view.getMonth()-1, 1);
  render();
});
document.getElementById("nextBtn").addEventListener("click", () => {
  view = new Date(view.getFullYear(), view.getMonth()+1, 1);
  render();
});
document.getElementById("todayBtn").addEventListener("click", () => {
  view = new Date();
  render();
});

render();
