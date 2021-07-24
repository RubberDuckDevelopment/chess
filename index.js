const files = ["a", "b", "c", "d", "e", "f", "g", "h"].reverse();
const pieces = [
  {
    name: "pawn",
    symbol: "p",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    img_white:
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    img_black:
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
  },
  {
    name: "rook",
    symbol: "r",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    img_white:
      "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    img_black:
      "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  },
  {
    name: "knight",
    symbol: "n",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    img_white:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    img_black:
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  },
  {
    name: "bishop",
    symbol: "b",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    img_white:
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    img_black:
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  },
  {
    name: "queen",
    symbol: "q",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    img_white:
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    img_black:
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  },
  {
    name: "king",
    symbol: "k",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    img_white:
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    img_black:
      "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
  },
];
const startingPosition =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

(function start() {
  resetBoard();
})();

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

    if (boardArr[i].rankOffset === 1) {
      cell.className += " offset";
    } else {
      cell.className += " even";
    }

    if (boardArr[i].hasPosition === 1) {
      cell.className = cell.className;
      const piece = document.createElement("div");
      piece.setAttribute(
        "name",
        `${boardArr[i].color} ${boardArr[i].piece.name}`
      );
      piece.className = "piece";

      const img = document.createElement("img");
      if (boardArr[i].color === "white") {
        img.src = boardArr[i].piece.img_white;
      } else {
        img.src = boardArr[i].piece.img_black;
      }

      piece.append(img);
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
  updateBoardBackground();
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

function parseFEN() {
  let FENentry = document.getElementById("fen-entry").value.split("/");

  let boardArr = returnBoardArray().reverse();

  let parsedFEN;
  let FEN = [];
  let cellCount = 0;

  for (let i = 0; i < 8; i++) {
    //parse each rank
    parsedFEN = parseRank(FENentry[i]);
    FEN.push(parsedFEN);
  }
  FEN.join();

  //   console.log(FEN);

  //console.table(FEN);
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      cellCount = j * 8 + i;
      if (isNaN(FEN[j][i]) == false) {
        //space
        //console.log("space".repeat(FEN[i]));
        for (let k = 0; k < FEN[j][i]; k++) {
          boardArr[cellCount + k].hasPosition = 0;
        }
      } else if (FEN[j][i].toUpperCase() == FEN[j][i]) {
        //white piece
        boardArr[cellCount].hasPosition = 1;
        boardArr[cellCount].color = "white";
        boardArr[cellCount].piece = parsePiece(FEN[j][i]);
      } else {
        //black piece
        boardArr[cellCount].hasPosition = 1;
        boardArr[cellCount].color = "black";
        boardArr[cellCount].piece = parsePiece(FEN[j][i]);
      }
    }
  }

  resetBoard(boardArr);
}

function parseRank(rank) {
  //input string of pieces & #spaces
  //return string with spaces separated
  let parsedRank = [];
  for (let i = 0; i < 8; i++) {
    if (isNaN(rank[i]) === true) {
      //piece
      parsedRank.push(rank[i]);
    } else {
      //space
      for (let j = 0; j < rank[i]; j++) {
        parsedRank.push(" ");
      }
    }
  }
  return parsedRank;
}

function parsePiece(pieceAbbreviation) {
  //input piece abbrevation
  //return piece object
  let parsedPiece = pieces.filter(
    (piece) => piece.symbol == pieceAbbreviation.toLowerCase()
  )[0];
  return parsedPiece;
}

function updateBoardBackground() {
  const offsetRow = document.querySelectorAll(".board .offset:nth-child(even)");
  const evenRow = document.querySelectorAll(".board .even:nth-child(odd)");

  const blackColorBg = document.getElementById("black-color-bg").value;
  const whiteColorBg = document.getElementById("white-color-bg").value;

  [...offsetRow].forEach((node) => colorCell(node, blackColorBg));
  [...evenRow].forEach((node) => colorCell(node, blackColorBg));

  const board = document.querySelector(".board");
  board.style.backgroundColor = whiteColorBg;
}

function colorCell(node, color) {
  node.style.backgroundColor = color;
}
