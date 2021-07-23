const files = ["a", "b", "c", "d", "e", "f", "g", "h"].reverse();
const pieces = ["pawn", "rook", "knight", "bishop", "queen", "king"];

function returnBoardArray(boardRanks = 8, boardFiles = 8) {
  let boardArr = new Array(boardRanks * boardFiles);

  for (let i = 0; i < boardArr.length; i++) {
    let file = i % files.length;
    file = files[file];

    let rank = parseInt(i / files.length) + 1;

    let rankOffset;
    if (rank % 2 === 0) {
      rankOffset = 1;
    } else {
      rankOffset = 0;
    }

    boardArr[i] = {
      rank: rank,
      file: file,
      rankOffset: rankOffset,
      hasPosition: 0,
      piece: null,
      color: null,
    };
  }
  return boardArr;
}

function generateBoard(boardArr) {
  const board = document.querySelector(".board");

  for (let i = 0; i < boardArr.length; i++) {
    const cell = document.createElement("div");

    cell.className = `cell`;
    cell.id = `${boardArr[i].file}${boardArr[i].rank}`;
    cell.setAttribute("name", "cell");
    //cell.textContent=`${boardArr[i].file}${boardArr[i].rank}`
    // cell.addEventListener("mouseover",handleHover)

    if (boardArr[i].rankOffset === 1) {
      cell.className += " offset";
    } else {
      cell.className += " even";
    }

    if (boardArr[i].hasPosition === 1) {
      cell.className = cell.className;
      const piece = document.createElement("div");
      piece.name = boardArr[i].piece;
      piece.className = "piece";
      piece.style.backgroundColor = boardArr[i].color;
      cell.append(piece);
    } else {
      //cell.className += " idk";
    }

    board.appendChild(cell);
  }
  //console.log(boardArr);
}

function resetBoard(boardArr = returnBoardArray().reverse()) {
  //console.log(boardArr);
  const board = document.querySelector(".board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  generateBoard(boardArr);
}

function formatPosition() {
  const position = document.getElementById("position-entry").value;
  const file = position[0];
  const rank = parseInt(position[1]);

  let boardArr = returnBoardArray().reverse();
  let boardIdx = boardArr.findIndex((e) => rank === e.rank && file === e.file);

  boardArr[boardIdx].hasPosition = 1;

  let pieceColor;
  if (document.getElementById("piece-black").checked) {
    pieceColor = "black";
  } else {
    pieceColor = "white";
  }

  boardArr[boardIdx].color = pieceColor;
  boardArr[boardIdx].piece = "pawn";

  resetBoard(boardArr);
}
