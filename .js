import { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState(null);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      {mode ? <Game mode={mode} /> : <Lobby onSelectMode={setMode} />}
    </main>
  );
}

// ---------- Lobby ----------
function Lobby({ onSelectMode }) {
  const modes = [
    { name: 'Classique', value: 'classic' },
    // D'autres modes peuvent être ajoutés ici
  ];

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">Méga Tic Tac Toe</h1>
      <p className="text-gray-400">Choisissez un mode de jeu</p>
      <div className="grid gap-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onSelectMode(mode.value)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-2xl transition"
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Game ----------
function Game({ mode }) {
  const [boards, setBoards] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [results, setResults] = useState(Array(9).fill(null));
  const [mainWinner, setMainWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [nextBoard, setNextBoard] = useState(null);

  function handleMove(boardIndex, cellIndex) {
    if (mainWinner || (nextBoard !== null && boardIndex !== nextBoard)) return;
    if (results[boardIndex] || boards[boardIndex][cellIndex]) return;

    const newBoards = boards.map((b, i) =>
      i === boardIndex ? b.map((c, j) => (j === cellIndex ? currentPlayer : c)) : b
    );

    const newResult = checkWinner(newBoards[boardIndex]);
    const newResults = results.map((r, i) => (i === boardIndex ? newResult : r));

    const overallWinner = checkWinner(newResults);

    setBoards(newBoards);
    setResults(newResults);
    setMainWinner(overallWinner);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    if (newResults[cellIndex]) {
      setNextBoard(null);
    } else {
      setNextBoard(cellIndex);
    }
  }

  return (
    <div className="text-center space-y-6">
      <h2 className="text-xl font-semibold">
        {mainWinner
          ? mainWinner === '-' ? 'Match nul !' : `${mainWinner} a gagné !`
          : `Tour de ${currentPlayer}`}
      </h2>
      <div className="grid grid-cols-3 gap-3 justify-center max-w-screen-sm mx-auto">
        {boards.map((board, i) => (
          <SmallBoard
            key={i}
            value={board}
            onClick={(j) => handleMove(i, j)}
            isActive={!mainWinner && (nextBoard === null || nextBoard === i)}
            result={results[i]}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- SmallBoard ----------
function SmallBoard({ value, onClick, isActive, result }) {
  return (
    <div
      className={`grid grid-cols-3 gap-1 p-1 rounded-2xl transition-all 
      ${isActive ? 'bg-white/10' : 'bg-white/5'} 
      w-full max-w-[100px] sm:max-w-[120px] aspect-square`}
    >
      {value.map((cell, i) => (
        <button
          key={i}
          onClick={() => onClick(i)}
          disabled={!!cell || result}
          className="aspect-square w-full rounded-2xl bg-white/10 hover:bg-white/20 text-2xl sm:text-3xl font-bold flex items-center justify-center"
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

// ---------- Winner Checker ----------
function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(cell => cell) ? '-' : null;
}
