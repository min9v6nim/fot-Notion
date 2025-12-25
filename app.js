const grid = document.getElementById("grid");
const title = document.getElementById("monthTitle");

let view = new Date();

// 🇰🇷 한국 공휴일
const holidays = {
  "2025-01-01":"신정",
  "2025-03-01":"삼일절",
  "2025-05-05":"어린이날",
  "2025-06-06":"현충일",
  "2025-08-15":"광복절",
  "2025-10-03":"개천절",
  "2025-10-09":"한글날",
  "2025-12-25":"성탄절"
};

const pad = n => String(n).padStart(2,"0");

function render(){
  const y = view.getFullYear();
  const m = view.getMonth();

  title.textContent = `${y}.${pad(m+1)}`;
  grid.innerHTML = "";

  const first = new Date(y,m,1);
  const last = new Date(y,m+1,0);

  const start = first.getDay();
  const days = last.getDate();

  const prevLast = new Date(y,m,0).getDate();

  for(let i=0;i<start;i++){
    grid.appendChild(makeCell(y,m-1,prevLast-start+i+1,true));
  }

  for(let d=1; d<=days; d++){
    grid.appendChild(makeCell(y,m,d,false));
  }

  while(grid.children.length < 42){
    grid.appendChild(makeCell(y,m+1,grid.children.length,false,true));
  }
}

function makeCell(y,m,d,muted){
  const date = new Date(y,m,d);
  const iso = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;

  const cell = document.createElement("div");
  cell.className = "day" + (muted ? " muted" : "");

  const n = document.createElement("div");
  n.className = "num";
  n.textContent = d;

  cell.appendChild(n);

  if(holidays[iso]){
    const h = document.createElement("div");
    h.className = "holiday";
    h.textContent = holidays[iso];
    cell.appendChild(h);
  }

  const today = new Date();
  if(date.toDateString() === today.toDateString()){
    cell.classList.add("today");
  }

  // 📌 날짜 클릭 → 노션 페이지
  cell.onclick = () => {
    const notionURL = "https://www.notion.so/여기에-네-노션-일정페이지";
    window.open(notionURL,"_blank");
  };

  return cell;
}

document.getElementById("prevBtn").onclick = () => {
  view = new Date(view.getFullYear(), view.getMonth()-1, 1);
  render();
};

document.getElementById("nextBtn").onclick = () => {
  view = new Date(view.getFullYear(), view.getMonth()+1, 1);
  render();
};

document.getElementById("todayBtn").onclick = () => {
  view = new Date();
  render();
};

render();
