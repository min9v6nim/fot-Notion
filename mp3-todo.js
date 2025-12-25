// ===== 오늘 할 일 (판매용: 사용자가 여기만 수정) =====
const todayTodos = [
  "회의 준비",
  "자료 정리",
  "운동 30분"
];

// ===== DOM =====
const widget = document.getElementById("mp3Widget");
const textEl = document.getElementById("todoText");

// 할 일 없으면 위젯 숨김
if (!todayTodos || todayTodos.length === 0) {
  widget.style.display = "none";
} else {
  let idx = 0;

  function showTodo() {
    textEl.style.opacity = 0;
    textEl.style.transform = "translateY(-60%)";

    setTimeout(() => {
      textEl.textContent = todayTodos[idx];
      textEl.style.opacity = 1;
      textEl.style.transform = "translateY(-50%)";
      idx = (idx + 1) % todayTodos.length;
    }, 300);
  }

  showTodo();
  setInterval(showTodo, 3000);
}

