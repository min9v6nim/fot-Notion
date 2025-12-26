// ===== Notion API 설정 =====
const NOTION_TOKEN = "secret_여기에_네_토큰";
const DATABASE_ID = "여기에_네_캘린더_DB_ID";

const grid = document.getElementById("grid");
const title = document.getElementById("monthTitle");

let view = new Date();

/* 2026 공휴일 + 근로자의날 */
const holidays = {
  "2026-01-01": true,
  "2026-02-16": true,
  "2026-02-17": true,
  "2026-02-18": true,
  "2026-03-01": true,
  "2026-03-02": true,
  "2026-05-01": true,
  "2026-05-05": true,
  "2026-05-24": true,
  "2026-05-25": true,
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
  "2026-12-25": true
};

const pad = n => String(n).padStart(2,"0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function render(){
  const y = view.getFullYear();
  const m = view.getMonth();

  title.textContent = `${y}.${pad(m+1)}`;
  grid.innerHTML = "";

  const first = new Date(y,m,1);
  const last = new Date(y,m+1,0);

  const start = first.getDay();
  const total = last.getDate();

  const cells = [];

  const prevLast = new Date(y,m,0).getDate();
  for(let i=0;i<start;i++){
    cells.push({d:new Date(y,m-1,prevLast-start+1+i), muted:true});
  }

  for(let d=1;d<=total;d++){
    cells.push({d:new Date(y,m,d), muted:false});
  }

  while(cells.length<42){
    cells.push({d:new Date(y,m+1,cells.length-total-start+1), muted:true});
  }

  const today = new Date().toDateString();

  cells.forEach(({d,muted})=>{
    const cell = document.createElement("div");
    cell.className = "day" + (muted ? " muted":"");

    const dow = d.getDay();
    if(dow===0) cell.classList.add("sun");
    if(dow===6) cell.classList.add("sat");

    const num = document.createElement("div");
    num.className="num";
    num.textContent=d.getDate();
    cell.appendChild(num);

    if(holidays[iso(d)]){
      cell.classList.add("holiday");
      const dot=document.createElement("div");
      dot.className="holidayDot";
      cell.appendChild(dot);
    }

    if(d.toDateString()===today){
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  });
}

document.getElementById("prevBtn").onclick=()=>{
  view=new Date(view.getFullYear(),view.getMonth()-1,1);
  render();
};
document.getElementById("nextBtn").onclick=()=>{
  view=new Date(view.getFullYear(),view.getMonth()+1,1);
  render();
};
document.getElementById("todayBtn").onclick=()=>{
  view=new Date();
  render();
};

render();
