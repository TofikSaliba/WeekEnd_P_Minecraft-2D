function startGame() {
  document.querySelector("#startBut").addEventListener("click", function () {
    this.disabled = true;
    const splash = document.querySelector("#splash");
    splash.classList.toggle("fade-in2");
    splash.style.animation = "fadeOut 1.5s ease-in forwards";
    document.querySelector(".toolsBox").style.visibility = "visible";

    setUnits(gameObj);
    drawTerrain(gameObj);
    styleClouds(gameObj);
    toolBoxListener(gameObj);
    bankListener(gameObj);
    resetButton(gameObj);
    setTimeout(() => {
      splash.style.display = "none";
      splash.style.zIndex = "-100";
      startListening(gameObj);
    }, 1500);
  });
}

function setUnits({ units, ROW_NUM, COL_NUM }) {
  const terrian = document.querySelector("#terrain");
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
      if (/Firefox/.test(navigator.userAgent)) {
        unit.style.minHeight = `${98.25 / ROW_NUM}vh`;
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
      giveType(units[i][j], i, units);
    }
  }
}

function giveType(unit, index, units) {
  const rand = (Math.random() * 4) | 0;
  switch (matrix[index][rand]) {
    case 0:
      break;
    case 1:
      if (unit.yIndex === 0 || unit.yIndex === 199 || unit.yIndex % 20 > 12) {
        break;
      }
      unit.setAttribute("Data-type", "cloud");
      break;
    case 2:
      if (
        ((Math.random() * 3) | 0) === 1 &&
        unit.yIndex % 4 === 3 &&
        unit.yIndex < 197
      ) {
        makeTree(unit, index, units);
      }
      break;
    case 3:
      if (
        ((Math.random() * 2) | 0) === 1 &&
        unit.yIndex < 198 &&
        unit.yIndex > 1
      ) {
        makeRock(unit, index, units);
      }
      break;
    case 4:
      unit.setAttribute("Data-type", "dirtGrass");
      break;
    case 5:
      unit.setAttribute("Data-type", "dirt");
      break;
    default:
      break;
  }
}

function styleClouds({ units, COL_NUM }) {
  for (let i = 1; i < 5; i++) {
    for (let j = 1; j < COL_NUM - 1; j++) {
      if (!units[i][j].getAttribute("Data-type")) {
        continue;
      }
      let top = !units[i - 1][j].getAttribute("Data-type"),
        left = !units[i][j - 1].getAttribute("Data-type"),
        bot = !units[i + 1][j].getAttribute("Data-type"),
        right = !units[i][j + 1].getAttribute("Data-type");
      if (top && bot && left && right) {
        units[i][j].removeAttribute("Data-type");
        continue;
      }
      if (top && left) {
        units[i][j].style.borderTopLeftRadius = "40%";
      }
      if (top && right) {
        units[i][j].style.borderTopRightRadius = "40%";
      }
      if (bot && left) {
        units[i][j].style.borderBottomLeftRadius = "40%";
      }
      if (bot && right) {
        units[i][j].style.borderBottomRightRadius = "40%";
      }
    }
  }
}

function makeTree(unit, index, units) {
  unit.setAttribute("Data-type", "tree");
  for (let i = 1; i < 7; i++) {
    if (i < 3) {
      units[index - i][unit.yIndex].setAttribute("Data-type", "tree");
    } else {
      units[index - i][unit.yIndex - 1].setAttribute("Data-type", "treeLeafs");
      units[index - i][unit.yIndex].setAttribute("Data-type", "treeLeafs");
      units[index - i][unit.yIndex + 1].setAttribute("Data-type", "treeLeafs");
    }
  }
}

function makeRock(unit, index, units) {
  unit.setAttribute("Data-type", "rock");
  if (unit.yIndex > 197) {
    return;
  }
  switch ((Math.random() * 4) | 0) {
    case 0:
      if (!units[index - 1][unit.yIndex].getAttribute("Data-type")) {
        units[index - 1][unit.yIndex].setAttribute("Data-type", "rock");
      }
      if (!units[index][unit.yIndex - 1].getAttribute("Data-type")) {
        units[index][unit.yIndex - 1].setAttribute("Data-type", "rock");
      }
      break;
    case 1:
      if (!units[index - 1][unit.yIndex].getAttribute("Data-type")) {
        units[index - 1][unit.yIndex].setAttribute("Data-type", "rock");
      }
      if (!units[index][unit.yIndex + 1].getAttribute("Data-type")) {
        units[index][unit.yIndex + 1].setAttribute("Data-type", "rock");
      }
      break;
    case 2:
      if (!units[index - 1][unit.yIndex].getAttribute("Data-type")) {
        units[index - 1][unit.yIndex].setAttribute("Data-type", "rock");
      }
      if (!units[index][unit.yIndex + 1].getAttribute("Data-type")) {
        units[index][unit.yIndex + 1].setAttribute("Data-type", "rock");
      }
      if (!units[index][unit.yIndex + 2].getAttribute("Data-type")) {
        units[index][unit.yIndex + 2].setAttribute("Data-type", "rock");
      }
      break;
    default:
      break;
  }
}

function checkCollapse(x, y, game) {
  let top = game.units[x - 1]
      ? game.units[x - 1][y].getAttribute("Data-type")
      : true,
    left = game.units[x][y - 1]
      ? game.units[x][y - 1].getAttribute("Data-type")
      : true,
    bot = game.units[x + 1]
      ? game.units[x + 1][y].getAttribute("Data-type")
      : true,
    right = game.units[x][y + 1]
      ? game.units[x][y + 1].getAttribute("Data-type")
      : true;

  const botLeft = game.units[x + 1]
      ? game.units[x + 1][y - 1]
        ? game.units[x + 1][y - 1].getAttribute("Data-type")
        : false
      : false,
    botRight = game.units[x + 1]
      ? game.units[x + 1][y + 1]
        ? game.units[x + 1][y + 1].getAttribute("Data-type")
        : false
      : false;
  if (
    ((left && botLeft) || (right && botRight)) &&
    game.units[x][y].getAttribute("Data-type") === "treeLeafs" &&
    bot === "tree"
  ) {
    return false;
  }

  if ((top && bot && !left && !right) || (!top && !bot && left && right)) {
    return true;
  }
  if (
    (top || left || right) &&
    game.units[x][y].getAttribute("Data-type") === "treeLeafs" &&
    bot === "tree"
  ) {
    return true;
  }

  const topLeft = game.units[x - 1]
      ? game.units[x - 1][y - 1]
        ? !game.units[x - 1][y - 1].getAttribute("Data-type")
        : false
      : false,
    topRight = game.units[x - 1]
      ? game.units[x - 1][y + 1]
        ? !game.units[x - 1][y + 1].getAttribute("Data-type")
        : false
      : false;
  if (
    (top && !left && topRight) ||
    (top && !right && topLeft) ||
    (top && topLeft && topRight)
  ) {
    return true;
  }
  return false;
}

function removeBlock(x, y, game) {
  if (checkCollapse(x, y, game)) {
    return false;
  }
  if (
    (game.units[x - 1] && !game.units[x - 1][y].getAttribute("Data-type")) ||
    (game.units[x + 1] && !game.units[x + 1][y].getAttribute("Data-type")) ||
    (game.units[x][y - 1] && !game.units[x][y - 1].getAttribute("Data-type")) ||
    (game.units[x][y + 1] && !game.units[x][y + 1].getAttribute("Data-type"))
  ) {
    game.units[x][y].removeAttribute("Data-type");
    return true;
  }
  if (x === 0) {
    game.units[x][y].removeAttribute("Data-type");
    return true;
  }

  return false;
}

function buildBlock(x, y, game) {
  let temp = game.building.block;
  if (
    temp === "tree" &&
    game.units[x + 1] &&
    game.units[x + 1][y].getAttribute("Data-type") &&
    game.units[x + 1][y].getAttribute("Data-type") === "dirtGrass"
  ) {
    if (game.bank[game.building[game.building.block]] > 0) {
      game.units[x][y].setAttribute("Data-type", game.building.block);
      return true;
    }
  }
  if (game.building.block === "treeLeafs") {
    temp = "tree";
  } else if (game.building.block === "dirtGrass") {
    temp = "dirt";
  }
  if (
    (game.units[x - 1] &&
      game.units[x - 1][y].getAttribute("Data-type") &&
      game.units[x - 1][y].getAttribute("Data-type").indexOf(temp) !== -1) ||
    (game.units[x + 1] &&
      game.units[x + 1][y].getAttribute("Data-type") &&
      game.units[x + 1][y].getAttribute("Data-type").indexOf(temp) !== -1) ||
    (game.units[x] &&
      game.units[x][y - 1] &&
      game.units[x][y - 1].getAttribute("Data-type") &&
      game.units[x][y - 1].getAttribute("Data-type").indexOf(temp) !== -1) ||
    (game.units[x] &&
      game.units[x][y + 1] &&
      game.units[x][y + 1].getAttribute("Data-type") &&
      game.units[x][y + 1].getAttribute("Data-type").indexOf(temp) !== -1)
  ) {
    if (game.bank[game.building[game.building.block]] > 0) {
      game.units[x][y].setAttribute("Data-type", game.building.block);
      return true;
    }
  }
  if (x + 1 === 20 && temp.indexOf("dirt") !== -1) {
    if (game.bank[game.building[game.building.block]] > 0) {
      game.units[x][y].setAttribute("Data-type", game.building.block);
      return true;
    }
  }
  if (
    temp === "rock" &&
    game.units[x + 1] &&
    game.units[x + 1][y].getAttribute("Data-type") &&
    game.units[x + 1][y].getAttribute("Data-type") === "dirtGrass"
  ) {
    if (game.bank[game.building[game.building.block]] > 0) {
      game.units[x][y].setAttribute("Data-type", game.building.block);
      return true;
    }
  }
  return false;
}

function removeTree(x, y, game) {
  if (!game.units[x - 1][y].getAttribute("Data-type")) {
    game.units[x][y].removeAttribute("Data-type");
    return true;
  }
  return false;
}

function toolBoxListener(game) {
  const tera = document.querySelector("#terrain");
  const tools = document.querySelectorAll(".tools img");
  const bank = document.querySelectorAll(".bank div");
  for (let i = 0; i < 3; i++) {
    tools[i].addEventListener("click", () => {
      if (!tools[i].classList.contains("current")) {
        tools.forEach((tool) => {
          tool.classList.remove("current");
        });
        bank.forEach((item) => {
          item.classList.remove("current");
        });
        tools[i].classList.add("current");
        if (i === 0) {
          game.currTool = "shovel";
        } else if (i === 1) {
          game.currTool = "pickaxe";
        } else {
          game.currTool = "axe";
        }
        tera.setAttribute("Data-tool", `${game.currTool}`);
      }
    });
  }
}

function bankListener(game) {
  const tera = document.querySelector("#terrain");
  const tools = document.querySelectorAll(".tools img");
  const bank = document.querySelectorAll(".bank div");
  for (let i = 0; i < 5; i++) {
    bank[i].addEventListener("click", () => {
      if (!bank[i].classList.contains("current")) {
        bank.forEach((item) => {
          item.classList.remove("current");
        });
        tools.forEach((tool) => {
          tool.classList.remove("current");
        });
        game.building.block = bank[i].classList[0].split("-")[1];
        bank[i].classList.add("current");
        game.currTool = "build";

        tera.setAttribute("Data-tool", `${game.currTool}`);
      }
    });
  }
}

function resetButton(game) {
  const resetBtn = document.querySelector(".crafting button");
  const bankCounters = document.querySelectorAll(".bank span");
  resetBtn.addEventListener("click", () => {
    document.querySelector("#terrain").innerHTML = "";
    while (game.units.length > 0) {
      game.units.pop();
    }
    game.bank = new Array(5).fill(0);
    bankCounters.forEach((item) => {
      item.innerText = 0;
      item.style.color = "red";
    });
    setUnits(game);
    setTimeout(() => {
      drawTerrain(game);
      styleClouds(game);
    }, 1000);
  });
}

function startListening(game) {
  const tera = document.querySelector("#terrain");
  tera.addEventListener("click", (e) => {
    let x = e.target.xIndex,
      y = e.target.yIndex;
    const bankCounters = document.querySelectorAll(".bank span");
    switch (e.target.getAttribute("Data-type")) {
      case "cloud":
        break;
      case "dirtGrass":
        if (game.currTool === "shovel") {
          if (removeBlock(x, y, game)) {
            game.bank[1] += 1;
            bankCounters[1].style.color = "#fff";
            bankCounters[1].innerText = game.bank[1];
          }
        }
        break;
      case "dirt":
        if (game.currTool === "shovel") {
          if (removeBlock(x, y, game)) {
            game.bank[0] += 1;
            bankCounters[0].style.color = "#fff";
            bankCounters[0].innerText = game.bank[0];
          }
        }
        break;
      case "tree":
        if (game.currTool === "axe") {
          if (removeTree(x, y, game)) {
            game.bank[3] += 1;
            bankCounters[3].style.color = "#fff";
            bankCounters[3].innerText = game.bank[3];
          }
        }
        break;
      case "treeLeafs":
        if (game.currTool === "axe") {
          if (removeBlock(x, y, game)) {
            game.bank[4] += 1;
            bankCounters[4].style.color = "#fff";
            bankCounters[4].innerText = game.bank[4];
          }
        }
        break;
      case "rock":
        if (game.currTool === "pickaxe") {
          if (removeBlock(x, y, game)) {
            game.bank[2] += 1;
            bankCounters[2].style.color = "#fff";
            bankCounters[2].innerText = game.bank[2];
          }
        }
        break;
      default:
        let index = game.building[game.building.block];
        if (game.currTool === "build") {
          if (buildBlock(x, y, game)) {
            game.bank[index] -= 1;
            bankCounters[index].innerText = game.bank[index];
            if (game.bank[index] === 0) {
              bankCounters[index].style.color = "red";
            }
          }
        }
        break;
    }
  });
}

const gameObj = {
  units: [],
  COL_NUM: 200,
  ROW_NUM: 20,
  currTool: "shovel",
  building: {
    block: "",
    dirt: 0,
    dirtGrass: 1,
    rock: 2,
    tree: 3,
    treeLeafs: 4,
  },
  bank: new Array(5).fill(0),
};

const matrix = [
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0],
  [0, 1, 1, 0, 1],
  [0, 1, 1, 0, 0],
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

startGame();
