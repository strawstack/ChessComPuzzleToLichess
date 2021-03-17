function getBoardHTML() {
    let s = "";
    document.querySelectorAll("#board-board>div").forEach(
        (e) => {
            s += `${e.className},`
        }
    );
    return s;
}

function getWhiteToMove() {
    return document.querySelector(".section-heading-title").innerText.indexOf("White") != -1;
}

let html = getBoardHTML();

let whiteToMove = getWhiteToMove();

let board = [];
for (let i = 0; i < 8; i++) {
    board.push(["0","0","0","0","0","0","0","0"]);
}

html = html.split(",").map(line => line.split(" "));

function makeSquare(sqStr) {
    return {
        row: 8 - parseInt(sqStr[1]) + 1, // rank
        col: 8 - parseInt(sqStr[0]) + 1 // file
    };
}

function makePiece(pieceStr) {
    return {
        white: pieceStr[0] == "w",
        type: pieceStr[1]
    };
}

function makeFenBoard(board) {
    let fenBoard = [];
    for (let r = 0; r < 8; r++) {
        let row = [];
        let count = 0;
        for (let c = 8 - 1; c >= 0; c--) {
            let pieceMaybe = board[r][c];
            if (pieceMaybe != 0) {
                if (count != 0) {
                    row.push(count);
                    count = 0;
                }
                row.push(pieceToFen(pieceMaybe));
            } else {
                count += 1;
            }
        }
        if (count != 0) {
            row.push(count);
        }
        fenBoard.push(row.join(""));
    }
    return fenBoard.join("/");
}

function pieceToFen(piece) {
    if (piece.white) {
        return piece.type.toUpperCase();
    } else {
        return piece.type.toLowerCase();
    }
}

function orderClasses(pieceMaybe) {
    if (pieceMaybe.length > 0 && pieceMaybe[0] == "piece") {
        if (pieceMaybe[1].indexOf("square") != -1) {
            return [pieceMaybe[0], pieceMaybe[2], pieceMaybe[1]];
        }
    }
    return pieceMaybe;
}

for (let _pieceMaybe of html) {

    pieceMaybe = orderClasses(_pieceMaybe);

    // Is this actually a piece
    if (pieceMaybe.length > 0 && pieceMaybe[0] == "piece") {
        let piece = makePiece(pieceMaybe[1]);
        let sq = makeSquare(pieceMaybe[2].split("-")[1]);
        board[sq.row - 1][sq.col - 1] = piece;
    }
}

let fenBoard = makeFenBoard(board);
let turn = (whiteToMove)?"w":"b";
let fenComplete = `${fenBoard} ${turn} - - 0 1`;
let url_fen = fenComplete.replaceAll(" ", "_");

console.log(`${fenComplete}\n\nhttps://lichess.org/analysis/standard/${url_fen}`);

// alert(`${fenComplete}\n\nhttps://lichess.org/analysis/standard/${url_fen}`);
