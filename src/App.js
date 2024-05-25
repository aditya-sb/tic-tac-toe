import './App.css';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className={`square ${value === 'X' ? 'x' : 'o'}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="container">
      <div className={`status ${winner === 'X' ? 'xstatus' : winner === 'O' ? 'ostatus' : ''}`}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [mode, setMode] = useState(null); // 'friend' or 'computer'
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setHistory(history.slice(0, nextMove + 1));
    setXIsNext(nextMove % 2 === 0);
  }

  function handleComputerPlay() {
    if (!xIsNext && mode === 'computer' && !calculateWinner(currentSquares)) {
      const emptySquares = currentSquares.map((square, index) => square === null ? index : null).filter(val => val !== null);
      const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      const nextSquares = currentSquares.slice();
      nextSquares[randomSquare] = 'O';
      handlePlay(nextSquares);
    }
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className='movebtn'>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      {!mode ? (
        <div className='mode-selection'>

          <button onClick={() => setMode('friend')} className='modebtn'>Play with Friend</button>
          <button onClick={() => setMode('computer')} className='modebtn'>Play with Computer</button>
        </div>
      ) : (
        <>
          <div className='game-board'>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
          <div className='game-info'>
            <ol>{moves}</ol>
          </div>
          {mode === 'computer' && handleComputerPlay()}
        </>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
