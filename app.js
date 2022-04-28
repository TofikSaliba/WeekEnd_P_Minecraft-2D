const terrian = document.querySelector(".terrain");
const toolBox = document.querySelector(".toolsBox");
const game = { units: [], tools: [], COL_NUM: 200, ROW_NUM: 20 };

console.dir(game.units);
console.dir(game.tools);

window.addEventListener("click", (e) => {
  console.log(e);
});

// let x = 2;

// window.addEventListener("mouseover", (e) => {
//   console.log(e);
//   if (e.target.classList.contains("tool") && x === 2) {
//     e.target.style.cursor = "wait";
//   } else {
//     e.target.style.cursor = "pointer";
//   }

//   if (e.target.classList.contains("unit")) {
//     x = 3;
//   }
// });

function drawTerrain({ units, ROW_NUM, COL_NUM }) {
  for (let i = 0; i < ROW_NUM; i++) {
    const row = new Array(COL_NUM);
    for (let j = 0; j < COL_NUM; j++) {
      const unit = document.createElement("div");
      unit.classList.toggle("unit");
      // units[i][j] = unit;
      units.push(row);
      terrian.appendChild(unit);
    }
  }
}

function drawTools({ tools }) {
  for (let i = 0; i < 5; i++) {
    const tool = document.createElement("div");
    tool.classList.toggle("tool");
    tools.push(tool);
    toolBox.appendChild(tool);
  }
}

drawTerrain(game);
drawTools(game);
