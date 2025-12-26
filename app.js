// ===== Notion API 설정 =====
const NOTION_TOKEN = "ntn_K91404737828xV5w5clbsiiyeP2aXgLprHjEhLFnDwR07Y";
const DATABASE_ID = "2d5220d08fb6802c864cdb1846ee9411";

const grid = document.getElementById("grid");
const title = document.getElementById("monthTitle");

let view = new Date();

/* 2026 공휴일 */
const holidays = {
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
  "2026-12-25": true
};

const pad = n => String(n).padStart(2,"0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

// ===== Notion 데이터 =====
let notionEventsByDate = {};

// ===== Notion 캘린더 불러오기 =====
async function fetchNotionEvents() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      }
    }
  );

  const data = await res.json();

  notionEventsByDate = {};

  data.results.forEach(page => {
    const title =
      page.properties.이름?.title?.[0]?.plain_text || "";

    const date =
      page.properties.날짜?.date?.start;

    if (!date) return;

    if (!notionEventsByDate[date]) {
      notionEventsByDate[date] = [];
    }
    notionEventsByDate[date].push(title);
  });
}

// ===== 캘린더 렌더 =====
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

    const key = iso(d);

    // 공휴일
    if(holidays[key]){
      cell.classList.add("holiday");
      const dot=document.createElement("div");
      dot.className="holidayDot";
      cell.appendChild(dot);
    }

    // 노션 일정
    if(notionEventsByDate[key]){
      const dot=document.createElement("div");
      dot.className="eventDot";
      dot.title = notionEventsByDate[key].join("\n");
      cell.appendChild(dot);
    }

    if(d.toDateString()===today){
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  });
}

// ===== 버튼 =====
document.getElementById("prevBtn").onclick=async ()=>{
  view=new Date(view.getFullYear(),view.getMonth()-1,1);
  await fetchNotionEvents();
  render();
};
document.getElementById("nextBtn").onclick=async ()=>{
  view=new Date(view.getFullYear(),view.getMonth()+1,1);
  await fetchNotionEvents();
  render();
};
document.getElementById("todayBtn").onclick=async ()=>{
  view=new Date();
  await fetchNotionEvents();
  render();
};

// ===== 초기 실행 =====
(async function init(){
  await fetchNotionEvents();
  render();
})();
