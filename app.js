const game = { units: [], tools: [], COL_NUM: 200, ROW_NUM: 20 };

const matrix = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [2, 2, 3, 2, 2],
  [4, 4, 4, 4, 4],
  [5, 5, 5, 5, 5],
  [5, 5, 5, 5, 5],
  [5, 5, 5, 5, 5],
  [5, 5, 5, 5, 5],
  [5, 5, 5, 5, 5],
  [5, 5, 5, 5, 5],
];

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

function makeTree(unit, index) {
  unit.setAttribute("Data-type", "tree");
  game.units[index - 1][unit.yIndex].setAttribute("Data-type", "tree");
  game.units[index - 2][unit.yIndex].setAttribute("Data-type", "tree");
  game.units[index - 3][unit.yIndex - 1].setAttribute("Data-type", "treeLeafs");
  game.units[index - 3][unit.yIndex].setAttribute("Data-type", "treeLeafs");
  game.units[index - 3][unit.yIndex + 1].setAttribute("Data-type", "treeLeafs");
  game.units[index - 4][unit.yIndex - 1].setAttribute("Data-type", "treeLeafs");
  game.units[index - 4][unit.yIndex].setAttribute("Data-type", "treeLeafs");
  game.units[index - 4][unit.yIndex + 1].setAttribute("Data-type", "treeLeafs");
  game.units[index - 5][unit.yIndex - 1].setAttribute("Data-type", "treeLeafs");
  game.units[index - 5][unit.yIndex].setAttribute("Data-type", "treeLeafs");
  game.units[index - 5][unit.yIndex + 1].setAttribute("Data-type", "treeLeafs");
}

function makeRock(unit, index) {
  unit.setAttribute("Data-type", "rock");
  switch ((Math.random() * 4) | 0) {
    case 0:
      if (!game.units[index - 1][unit.yIndex].getAttribute("Data-type")) {
        game.units[index - 1][unit.yIndex].setAttribute("Data-type", "rock");
      }
      if (!game.units[index][unit.yIndex - 1].getAttribute("Data-type")) {
        game.units[index][unit.yIndex - 1].setAttribute("Data-type", "rock");
      }
      break;
    case 1:
      if (!game.units[index - 1][unit.yIndex].getAttribute("Data-type")) {
        game.units[index - 1][unit.yIndex].setAttribute("Data-type", "rock");
      }
      if (!game.units[index][unit.yIndex + 1].getAttribute("Data-type")) {
        game.units[index][unit.yIndex + 1].setAttribute("Data-type", "rock");
      }
      break;
    case 2:
      if (!game.units[index - 1][unit.yIndex].getAttribute("Data-type")) {
        game.units[index - 1][unit.yIndex].setAttribute("Data-type", "rock");
      }
      if (!game.units[index][unit.yIndex + 2].getAttribute("Data-type")) {
        game.units[index][unit.yIndex + 2].setAttribute("Data-type", "rock");
      }
      if (!game.units[index][unit.yIndex + 1].getAttribute("Data-type")) {
        game.units[index][unit.yIndex + 1].setAttribute("Data-type", "rock");
      }
      break;
    default:
      break;
  }
}

function giveType(unit, index) {
  const rand = (Math.random() * 4) | 0;
  switch (matrix[index][rand]) {
    case 0:
      break;
    case 1:
      unit.setAttribute("Data-type", "cloud");
      break;
    case 2:
      if (((Math.random() * 3) | 0) === 1 && unit.yIndex % 4 === 3) {
        makeTree(unit, index);
      }
      break;
    case 3:
      if (((Math.random() * 2) | 0) === 1) {
        makeRock(unit, index);
      }
      break;
    case 4:
      unit.setAttribute("Data-type", "grass");
      break;
    case 5:
      unit.setAttribute("Data-type", "dirt");
      break;
    default:
      break;
  }
}

function setUnits({ units, ROW_NUM, COL_NUM }) {
  const terrian = document.querySelector(".terrain");
  for (let i = 0; i < ROW_NUM; i++) {
    const row = new Array(COL_NUM);
    for (let j = 0; j < COL_NUM; j++) {
      const unit = document.createElement("div");
      unit.classList.toggle("unit");
      if (i < ROW_NUM / 2 + 3) {
        unit.classList.toggle("emptySky");
      } else {
        unit.classList.toggle("emptyGround");
      }
      unit.xIndex = i;
      unit.yIndex = j;
      terrian.appendChild(unit);
      row[j] = unit;
    }
    units.push(row);
  }
}

function drawTerrain({ units, ROW_NUM, COL_NUM }) {
  for (let i = ROW_NUM - 1; i >= 0; i--) {
    for (let j = 0; j < COL_NUM; j++) {
      giveType(units[i][j], i);
    }
  }
}

function drawTools({ tools }) {
  const toolBox = document.querySelector(".toolsBox");
  for (let i = 0; i < 5; i++) {
    const tool = document.createElement("div");
    tool.classList.toggle("tool");
    tools.push(tool);
    toolBox.appendChild(tool);
  }
}

function startGame() {
  document.querySelector("#startBut").addEventListener("click", function () {
    this.disabled = true;
    const splash = document.querySelector("#splash");
    splash.classList.toggle("fade-in2");
    splash.style.animation = "fadeOut 1.5s ease-in forwards";
    setUnits(game);
    // console.dir(game.units);
    // console.dir(game.tools);
    drawTools(game);
    drawTerrain(game);
    setTimeout(() => {
      splash.style.display = "none";
      splash.style.zIndex = "-100";
    }, 1500);
  });
}

startGame();
