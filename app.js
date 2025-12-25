const grid = document.getElementById("grid");
const title = document.getElementById("monthTitle");

let view = new Date();

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

  for(let d=1; d<=last.getDate(); d++){
    const date = new Date(y,m,d);
    const iso = `${y}-${pad(m+1)}-${pad(d)}`;

    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<div>${d}</div>`;

    if(holidays[iso]){
      cell.innerHTML += `<div class="holiday">${holidays[iso]}</div>`;
    }

    const today = new Date();
    if(date.toDateString() === today.toDateString()){
      cell.classList.add("today");
    }

    cell.onclick = () => {
      window.open(
        "https://www.notion.so/여기에-네-노션-페이지",
        "_blank"
      );
    };

    grid.appendChild(cell);
  }
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
