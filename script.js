"use strict";

//for when the player hasn't selected a spot to begin yet
let startFound = false;
let lostGame = false;
let minesweeperGrid;
let numFlags = undefined;

//for clicking on the board (before and after the game has started)
document
  .querySelector(".game-board__grid")
  .addEventListener("click", function (e) {
    console.log(minesweeperGrid);

    if (startFound && !lostGame) {
      if (e.target.className === "button") {
        // console.log("button clicked");
        const row =
          e.target.parentNode.parentNode.parentNode.className.substring(3) - 1;
        const col = e.target.parentNode.parentNode.className.substring(3) - 1;

        let text = document.querySelector(
          `.row${row + 1} .col${col + 1} h1`
        ).textContent;

        if (text == "" && numFlags > 0) {
          document.querySelector(
            `.row${row + 1} .col${col + 1} h1`
          ).textContent = "🚩";
          numFlags--;
          document.querySelector(`.score-keeper`).textContent =
            numFlags + " 🚩";
        } else if (text == "🚩") {
          document.querySelector(
            `.row${row + 1} .col${col + 1} h1`
          ).textContent = "";
          numFlags++;
          document.querySelector(`.score-keeper`).textContent =
            numFlags + " 🚩";
        }
      } else {
        const row = Number(e.target.parentNode.className.substring(3)) - 1;
        const col = Number(e.target.className.substring(3)) - 1;
        let num = minesweeperGrid[row][col];
        if (startFound && num != -1 && num != 0) {
          let cell = document.querySelector(`.row${row + 1} .col${col + 1}`);
          num === 1
            ? (cell.style.backgroundColor = "yellowgreen")
            : num === 2
            ? (cell.style.backgroundColor = "yellow")
            : num === 3
            ? (cell.style.backgroundColor = "orange")
            : (cell.style.backgroundColor = "red");
          document.querySelector(
            `.row${row + 1} .col${col + 1} h1`
          ).textContent = minesweeperGrid[row][col];
        } else if (startFound && !lostGame && num == -1) {
          displayMines(minesweeperGrid);
          lostGame = true;
          document.querySelector(`.game-board__div`).style.backgroundColor =
            "gray";
          // console.log(lostGame);
        } else if (startFound && !lostGame && num == 0) {
          grid2DSearch(minesweeperGrid, row, col);
        }
      }
    } else if (!startFound) {
      const row = Number(e.target.parentNode.className.substring(3)) - 1;
      const col = Number(e.target.className.substring(3)) - 1;
      let startingGridPoints = createGridFromPoint(createEmptyGrid(), row, col);
      for (let el of startingGridPoints) {
        if (minesweeperGrid[el[0]][el[1]] !== 0) {
          document.querySelector(
            `.row${el[0] + 1} .col${el[1] + 1} h1`
          ).textContent = minesweeperGrid[el[0]][el[1]];

          let cell = document.querySelector(
            `.row${el[0] + 1} .col${el[1] + 1}`
          );
          minesweeperGrid[el[0]][el[1]] === 2
            ? (cell.style.backgroundColor = "yellow")
            : minesweeperGrid[el[0]][el[1]] === 3
            ? (cell.style.backgroundColor = "orange")
            : minesweeperGrid[el[0]][el[1]] > 3
            ? (cell.style.backgroundColor = "red")
            : (cell.style.backgroundColor = "yellowGreen");
        }
      }
      // console.log(countedMines);
      // displayMines(minesweeperGrid);
      console.log(numberOfBombs(minesweeperGrid));
      numFlags = numberOfBombs(minesweeperGrid);
      document.querySelector(`.score-keeper`).textContent = numFlags + " 🚩";
      startFound = true;
    }
    console.log(minesweeperGrid);
  });

document.querySelector("#give-up").addEventListener("click", function () {
  if (startFound) {
    displayMines(minesweeperGrid);
    lostGame = true;
    document.querySelector(`.game-board__div`).style.backgroundColor = "gray";
  }
});

//show flag when hovering over
document
  .querySelector(".game-board__grid")
  .addEventListener("mouseover", function (e) {
    let nameOfClass = e.target;
    console.log(nameOfClass.className);

    if (startFound && nameOfClass.className !== "game-board__grid") {
      console.log(e.target);
      let row;
      let col;
      if (nameOfClass.className === "button") {
        row = Number(
          e.target.parentNode.parentNode.parentNode.className.substring(3)
        );
        col = Number(e.target.parentNode.parentNode.className.substring(3));
      } else {
        row = Number(e.target.parentNode.className.substring(3));
        col = Number(e.target.className.substring(3));
        console.log(row, col);
      }
      let color = document.querySelector(`.row${row} .col${col}`).style
        .backgroundColor;

      //NEED TO FIX
      if (
        color !== "yellowgreen" &&
        color !== "yellow" &&
        color !== "orange" &&
        color !== "red" &&
        document.querySelector(`.game-board__div`).style.backgroundColor !==
          "gray"
      ) {
        document.querySelector(`.row${row} .col${col} div`)
          ? (document.querySelector(`.row${row} .col${col} div`).style.display =
              "block")
          : null;
      }
    }
  });

//don't show flag when mouse no longer hovering
document
  .querySelector(".game-board__grid")
  .addEventListener("mouseout", function (e) {
    //NEED TO FIX
    let nameOfClass = e.target;
    if (startFound && nameOfClass.className !== "game-board__grid") {
      let row;
      let col;
      if (nameOfClass.className === "button") {
        row = Number(
          e.target.parentNode.parentNode.parentNode.className.substring(3)
        );
        col = Number(e.target.parentNode.parentNode.className.substring(3));
      } else {
        row = Number(e.target.parentNode.className.substring(3));
        col = Number(e.target.className.substring(3));
        console.log(row, col);
      }

      document.querySelector(`.row${row} .col${col} div`)
        ? (document.querySelector(`.row${row} .col${col} div`).style.display =
            "none")
        : null;
    }
  });

document.querySelector("#reset").addEventListener("click", function () {
  startFound = false;
  lostGame = false;
  for (let i = 1; i <= minesweeperGrid.length; i++) {
    for (let j = 1; j <= minesweeperGrid[i - 1].length; j++) {
      console.log("color change");
      document.querySelector(`.row${i} .col${j}`).style.backgroundColor =
        "peachpuff";
      document.querySelector(`.row${i} .col${j} h1`).textContent = "";
    }
  }

  document.querySelector(`.score-keeper`).textContent = "";
  minesweeperGrid = undefined;
  numFlags = undefined;
});
// document.querySelector(`.row5 .col4`).style.backgroundColor = "pink";

//anytime player presses on a spot that is not touching a bomb, it reveals all blocks not touching a bomb

//to get the player started: player presses on any block on the screen - reveals a border of touching bombs

function newCountMines(startingGrid) {
  let minesCounterGrid = [];
  for (let i = 0; i < startingGrid.length; i++) {
    minesCounterGrid.push([]);
    for (let j = 0; j < startingGrid[i].length; j++) {
      if (startingGrid[i][j] == 0) {
        minesCounterGrid[i].push(0);
      } else if (startingGrid[i][j] == -1) {
        minesCounterGrid[i].push(-1);
      } else {
        minesCounterGrid[i].push(0);

        const [
          topLeft,
          topMid,
          topRight,
          midLeft,
          midRight,
          botLeft,
          botMid,
          botRight,
        ] = [
          i == 0 || j == 0 ? null : [i - 1, j - 1],
          i == 0 ? null : [i - 1, j],
          i == 0 || j == 9 ? null : [i - 1, j + 1],
          j == 0 ? null : [i, j - 1],
          j == 9 ? null : [i, j + 1],
          i == 9 || j == 0 ? null : [i + 1, j - 1],
          i == 9 ? null : [i + 1, j],
          i == 9 || j == 9 ? null : [i + 1, j + 1],
        ];
        // console.log(
        //   topLeft,
        //   topMid,
        //   topRight,
        //   midLeft,
        //   midRight,
        //   botLeft,
        //   botMid,
        //   botRight
        // );
        function addOneBomb(pos, startGrid, counterGrid, i, j) {
          // console.log(pos);
          if (pos !== null && startGrid[pos[0]][pos[1]] === -1) {
            counterGrid[i][j]++;
          }
        }

        addOneBomb(topLeft, startingGrid, minesCounterGrid, i, j);
        addOneBomb(topRight, startingGrid, minesCounterGrid, i, j);
        addOneBomb(topMid, startingGrid, minesCounterGrid, i, j);
        addOneBomb(botLeft, startingGrid, minesCounterGrid, i, j);
        addOneBomb(botRight, startingGrid, minesCounterGrid, i, j);
        addOneBomb(botMid, startingGrid, minesCounterGrid, i, j);
        addOneBomb(midLeft, startingGrid, minesCounterGrid, i, j);
        addOneBomb(midRight, startingGrid, minesCounterGrid, i, j);
      }
    }
  }
  return minesCounterGrid;
}

//displays all of the mines
function displayMines(minesNum) {
  for (let i = 0; i < minesNum.length; i++) {
    // console.log(minesNum[i].length);
    for (let j = 0; j < minesNum[i].length; j++) {
      let row = `.row${i + 1}`;
      let col = `.col${j + 1}`;
      if (minesNum[i][j] == -1) {
        document.querySelector(`${row} ${col} h1`).textContent = "💣";
      } else if (minesNum[i][j] !== 0) {
        document.querySelector(`${row} ${col} h1`).textContent = minesNum[i][j];
      }
    }
  }
}

function numberOfBombs(minesNum) {
  let count = 0;
  for (let i = 0; i < minesNum.length; i++) {
    // console.log(minesNum[i].length);
    for (let j = 0; j < minesNum[i].length; j++) {
      if (minesNum[i][j] == -1) {
        count++;
      }
    }
  }
  return count;
}

function grid2DSearch(numOfMines, i, j) {
  if (i >= 0 && i < numOfMines.length && j >= 0 && j < numOfMines.length) {
    let color = document.querySelector(`.row${i + 1} .col${j + 1}`).style
      .backgroundColor;

    if (numOfMines[i][j] == 0 && color != "yellowgreen") {
      document.querySelector(
        `.row${i + 1} .col${j + 1}`
      ).style.backgroundColor = "yellowgreen";
      document.querySelector(`.row${i + 1} .col${j + 1} h1`).textContent = "";
      grid2DSearch(numOfMines, i - 1, j);
      grid2DSearch(numOfMines, i + 1, j);
      grid2DSearch(numOfMines, i, j - 1);
      grid2DSearch(numOfMines, i, j + 1);
    } else if (numOfMines[i][j] != -1 && numOfMines[i][j] != 0) {
      if (numOfMines[i][j] === 2) {
        document.querySelector(
          `.row${i + 1} .col${j + 1}`
        ).style.backgroundColor = "yellow";
      } else if (numOfMines[i][j] === 3) {
        document.querySelector(
          `.row${i + 1} .col${j + 1}`
        ).style.backgroundColor = "orange";
      } else if (numOfMines[i][j] > 3) {
        document.querySelector(
          `.row${i + 1} .col${j + 1}`
        ).style.backgroundColor = "red";
      } else {
        document.querySelector(
          `.row${i + 1} .col${j + 1}`
        ).style.backgroundColor = "yellowgreen";
      }
      document.querySelector(`.row${i + 1} .col${j + 1} h1`).textContent =
        numOfMines[i][j];
    }
  }
}

function createEmptyGrid() {
  let newGrid = [];
  for (let i = 0; i < 10; i++) {
    newGrid.push([]);
    for (let j = 0; j < 10; j++) {
      newGrid[i].push(null);
    }
  }
  return newGrid;
}

//creates a grid from the point that the user first selects
function createGridFromPoint(emptyGrid, i, j) {
  // debugger;
  const startCoords = new Set();
  startCoords.add([i, j]);

  emptyGrid[i][j] = 0;
  document.querySelector(`.row${i + 1} .col${j + 1}`).style.backgroundColor =
    "yellowgreen";
  let startNum = Math.trunc(Math.random() * 10) + 9;
  const thresh = 0.2;

  let randNum = Math.random();

  while (randNum < thresh) {
    randNum = Math.random();
  }

  while (i < 9 && i > 0 && j < 9 && j > 0 && startCoords.size < startNum) {
    const coords = [];

    if (randNum > thresh && emptyGrid[i - 1][j - 1] != 0) {
      emptyGrid[i - 1][j - 1] = 0;
      document.querySelector(`.row${i} .col${j}`).style.backgroundColor =
        "yellowgreen";
      startCoords.add([i - 1, j - 1]);
      coords.push([i - 1, j - 1]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i - 1][j] != 0) {
      emptyGrid[i - 1][j] = 0;
      document.querySelector(`.row${i} .col${j + 1}`).style.backgroundColor =
        "yellowgreen";
      startCoords.add([i - 1, j]);
      coords.push([i - 1, j]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i - 1][j + 1] != 0) {
      emptyGrid[i - 1][j + 1] = 0;
      document.querySelector(`.row${i} .col${j + 2}`).style.backgroundColor =
        "yellowgreen";
      startCoords.add([i - 1, j + 1]);
      coords.push([i - 1, j + 1]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i][j - 1] != 0) {
      emptyGrid[i][j - 1] = 0;
      document.querySelector(`.row${i + 1} .col${j}`).style.backgroundColor =
        "yellowgreen";
      startCoords.add([i, j - 1]);
      coords.push([i, j - 1]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i][j] != 0) {
      emptyGrid[i][j] = 0;
      document.querySelector(
        `.row${i + 1} .col${j + 1}`
      ).style.backgroundColor = "yellowgreen";
      startCoords.add([i, j]);
      coords.push([i, j]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i][j + 1] != 0) {
      emptyGrid[i][j + 1] = 0;
      document.querySelector(
        `.row${i + 1} .col${j + 2}`
      ).style.backgroundColor = "yellowgreen";
      startCoords.add([i, j + 1]);
      coords.push([i, j + 1]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i + 1][j - 1] != 0) {
      emptyGrid[i + 1][j - 1] = 0;
      document.querySelector(`.row${i + 2} .col${j}`).style.backgroundColor =
        "yellowgreen";
      startCoords.add([i + 1, j - 1]);
      coords.push([i + 1, j - 1]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i + 1][j] != 0) {
      emptyGrid[i + 1][j] = 0;
      document.querySelector(
        `.row${i + 2} .col${j + 1}`
      ).style.backgroundColor = "yellowgreen";
      startCoords.add([i + 1, j]);
      randNum = Math.random();
    }
    if (randNum > thresh && emptyGrid[i + 1][j + 1] != 0) {
      emptyGrid[i + 1][j + 1] = 0;
      document.querySelector(
        `.row${i + 2} .col${j + 2}`
      ).style.backgroundColor = "yellowgreen";
      startCoords.add([i + 1, j + 1]);
      randNum = Math.random();
    }
    // console.log(startCoords);
    // console.log("size: ", startCoords.size);
    if (coords.length != 0) {
      let randomStart = Math.trunc(Math.random(coords.length));
      [i, j] = coords[randomStart];
      // console.log(i, j);
      // console.log(randNum, numZeros);
    }
    while (randNum < thresh) {
      randNum = Math.random();
    }
  }

  // sets all the blocks touching the zero blocks to negative 2
  let negativeTwoBlocks = new Set();
  for (let item of startCoords) {
    // console.log(item);
    let [row, col] = item;
    // console.log(row, col);
    const [
      topLeft,
      topMid,
      topRight,
      midLeft,
      midRight,
      botLeft,
      botMid,
      botRight,
    ] = [
      row == 0 || col == 0 ? null : [row - 1, col - 1],
      row == 0 ? null : [row - 1, col],
      row == 0 || col == 9 ? null : [row - 1, col + 1],
      col == 0 ? null : [row, col - 1],
      col == 9 ? null : [row, col + 1],
      row == 9 || col == 0 ? null : [row + 1, col - 1],
      row == 9 ? null : [row + 1, col],
      row == 9 || col == 9 ? null : [row + 1, col + 1],
    ];

    function setToNegativeTwo(loc) {
      if (loc && emptyGrid[loc[0]][loc[1]] != 0) {
        emptyGrid[loc[0]][loc[1]] = -2;
        document.querySelector(
          `.row${loc[0] + 1} .col${loc[1] + 1}`
        ).style.backgroundColor = "yellowgreen";
        negativeTwoBlocks.add(`${loc[0]} ${loc[1]}`);
      }
    }

    setToNegativeTwo(topLeft, emptyGrid);
    setToNegativeTwo(topMid, emptyGrid);
    setToNegativeTwo(topRight, emptyGrid);
    setToNegativeTwo(botLeft, emptyGrid);
    setToNegativeTwo(botMid, emptyGrid);
    setToNegativeTwo(botRight, emptyGrid);
    setToNegativeTwo(midLeft, emptyGrid);
    setToNegativeTwo(midRight, emptyGrid);
  }

  //fill with random number of bombs
  let startingGridPoints = [...startCoords];
  for (let coord of negativeTwoBlocks) {
    let [row, col] = [Number(coord.split(" ")[0]), Number(coord.split(" ")[1])];
    startingGridPoints.push([row, col]);

    const [
      topLeft,
      topMid,
      topRight,
      midLeft,
      midRight,
      botLeft,
      botMid,
      botRight,
    ] = [
      row == 0 || col == 0 ? null : [row - 1, col - 1],
      row == 0 ? null : [row - 1, col],
      row == 0 || col == 9 ? null : [row - 1, col + 1],
      col == 0 ? null : [row, col - 1],
      col == 9 ? null : [row, col + 1],
      row == 9 || col == 0 ? null : [row + 1, col - 1],
      row == 9 ? null : [row + 1, col],
      row == 9 || col == 9 ? null : [row + 1, col + 1],
    ];

    //getting availables spots (for possible bombs) of -2 blocks
    const avSpots = availableSpots(
      topLeft,
      topMid,
      topRight,
      midLeft,
      midRight,
      botLeft,
      botMid,
      botRight,
      emptyGrid
    );

    //counting the number of bombs around a negative 2 block
    let bombsAround = 0;
    for (let el of avSpots) {
      emptyGrid[el[0]][el[1]] === -1 ? bombsAround++ : (bombsAround += 0);
    }

    while (bombsAround < 1) {
      if (avSpots.length != 0) {
        bombsAround = 0;
        for (let el of avSpots) {
          let rn = Math.random();
          rn < 0.3
            ? (emptyGrid[el[0]][el[1]] = -1)
            : (emptyGrid[el[0]][el[1]] = null);
          emptyGrid[el[0]][el[1]] === -1 ? bombsAround++ : (bombsAround += 0);
        }
      } else {
        emptyGrid[row][col] = 0;
        break;
      }
    }
    // console.log(emptyGrid[row][col], bombsAround, row, col);
    // console.log(emptyGrid);
  }

  // console.log(startCoords, emptyGrid);
  //adding in the rest of the bombs
  addInBombs(emptyGrid, startCoords);
  minesweeperGrid = newCountMines(emptyGrid);

  // console.log(minesweeperGrid);
  // console.log("starting points: ", startingGridPoints);
  return startingGridPoints;
}

//returns the available spots around a -2 block
function availableSpots(tl, tm, tr, ml, mr, bl, bm, br, grid) {
  const availableCoords = [];

  validSpot(tl, availableCoords, grid);
  validSpot(tm, availableCoords, grid);
  validSpot(tr, availableCoords, grid);
  validSpot(ml, availableCoords, grid);
  validSpot(mr, availableCoords, grid);
  validSpot(bl, availableCoords, grid);
  validSpot(bm, availableCoords, grid);
  validSpot(br, availableCoords, grid);
  function validSpot(loc, aCoords, gridRead) {
    // console.log(gridRead);
    if (
      loc &&
      gridRead[loc[0]][loc[1]] !== -2 &&
      gridRead[loc[0]][loc[1]] !== 0
    ) {
      aCoords.push(loc);
    }
  }
  return availableCoords;
}

//adds in bombs additional bombs to our starting grid
function addInBombs(grid, sc) {
  // console.log(sc);
  let th = ((100 - sc.size) / 100) * 0.1;
  // console.log(th);
  // console.log("here is grud: ", grid);
  for (let i in grid) {
    for (let j in grid[i]) {
      let bombProb = Math.random();
      if (grid[i][j] === null) {
        bombProb < th ? (grid[i][j] = -1) : (grid[i][j] = null);
      }
    }
  }
}

// function countMines(grid) {
//   let minesCounterGrid = [];
//   for (let row = 0; row < grid.length; row++) {
//     minesCounterGrid.push([]);
//     for (let col = 0; col < grid[row].length; col++) {
//       const [
//         topLeft,
//         topMid,
//         topRight,
//         midLeft,
//         midRight,
//         botLeft,
//         botMid,
//         botRight,
//       ] = [
//         row == 0 || col == 0 ? null : [row - 1, col - 1],
//         row == 0 ? null : [row - 1, col],
//         row == 0 || col == 9 ? null : [row - 1, col + 1],
//         col == 0 ? null : [row, col - 1],
//         col == 9 ? null : [row, col + 1],
//         row == 9 || col == 0 ? null : [row + 1, col - 1],
//         row == 9 ? null : [row + 1, col],
//         row == 9 || col == 9 ? null : [row + 1, col + 1],
//       ];

//       if (grid[i][j] == null) {
//         minesCounterGrid[i].push(0);
//         topLeft && topLeft !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         topMid && topMid !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         topRight && topRight !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         midLeft && midLeft !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         midRight && midRight !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         botLeft && botLeft !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         botMid && boMid !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         botMid && botRight !== -1
//           ? minesCounterGrid[i][j]++
//           : (minesCounterGrid[i][j] += 0);
//         /*if (i != 0 && j != 0 && i != 9 && j != 9) {
//           grid[i - 1][j] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i][j - 1] ? minesCounterGrid[i][j]++ : "";
//         } else if (i === 0 && j != 0 && j != 9) {
//           grid[i][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j] ? minesCounterGrid[i][j]++ : "";
//         } else if (i === 9 && j != 0 && j != 9) {
//           grid[i][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j] ? minesCounterGrid[i][j]++ : "";
//         } else if (j === 0 && i != 0 && i != 9) {
//           grid[i - 1][j] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i][j + 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j + 1] ? minesCounterGrid[i][j]++ : "";
//         } else if (j === 9 && i != 0 && i != 9) {
//           grid[i - 1][j] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j] ? minesCounterGrid[i][j]++ : "";
//           grid[i + 1][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i][j - 1] ? minesCounterGrid[i][j]++ : "";
//           grid[i - 1][j - 1] ? minesCounterGrid[i][j]++ : "";
//         }
//         */
//       } else {
//         minesCounterGrid[i].push(-1);
//       }
//     }
//   }

//   return minesCounterGrid;
// }
