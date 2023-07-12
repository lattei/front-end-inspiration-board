import { useEffect, useState } from "react";
import "./style.css";

const initialCards = [
  {
    id: 1,
    text: "Maybe the dingo ate your baby.",
    source: "",
    board: "fabiola",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2023,
  },
  {
    id: 2,
    text: "I wish I had a book for every book I have.",
    source: "Paraphrase from the movie 'Arthur'.",
    board: "ann",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 1989,
  },
  {
    id: 3,
    text: "I'm not superstitious, but I am a little stitious.",
    source: "The Office",
    board: "carline",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
  {
    id: 4,
    text: "I don't know where I'm going from here but I promise it won't be boring.",
    source: "Ziggy Stardust",
    board: "erina",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [boards, setBoards] = useState(BOARDS);
  const [selectedBoard, setSelectedBoard] = useState("");

  // Fetch initial data from the server and update state
  // useEffect(() => {
  //   fetch('/api/cards')
  //     .then((response) => response.json())
  //     .then((data) => setCards(data));
  // }, []);

  const addBoard = (newBoard) => {
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleFormToggle = () => {
    setShowForm((show) => !show);
    setSelectedBoard("");
  };

  const handleNewBoardToggle = () => {
    setShowForm(true);
    setSelectedBoard("");
  };

  const handleExistingBoardToggle = (boardName) => {
    setSelectedBoard(boardName);
  };

  // Fetch data for the selected board from the server and update state
  // useEffect(() => {
  //   if (selectedBoard !== "") {
  //     fetch(`/api/boards/${selectedBoard}/cards`)
  //       .then((response) => response.json())
  //       .then((data) => setCards(data));
  //   }
  // }, [selectedBoard]);

  return (
    <>
      <Header
        showForm={showForm}
        setShowForm={setShowForm}
        boards={boards}
        addBoard={addBoard}
        handleFormToggle={handleFormToggle}
        handleNewBoardToggle={handleNewBoardToggle}
        handleExistingBoardToggle={handleExistingBoardToggle}
      />

      {showForm ? (
        <NewCardForm
          setCards={setCards}
          setShowForm={setShowForm}
          boards={boards}
          selectedBoard={selectedBoard}
        />
      ) : null}

      <main className="main">
        <BoardFilter
          boards={boards}
          handleExistingBoardToggle={handleExistingBoardToggle}
          handleAllBoardToggle={() => setSelectedBoard("")}
          showAllBoards={!selectedBoard}
        />
        <Cardlist cards={cards} boards={boards} selectedBoard={selectedBoard} />
      </main>
    </>
  );
}

function Header({
  showForm,
  addBoard,
  handleFormToggle,
}) {
  const appTitle = "In Your Face";
  const [board, setBoard] = useState("");

  const handleBoardSubmit = (e) => {
    e.preventDefault();

    if (board) {
      const newBoard = { name: board, color: getRandomColor() };
      addBoard(newBoard);
      setBoard("");
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="In your face logo" />
        <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={handleFormToggle}>
        {showForm ? "Close" : "Share your inspiration"}
      </button>

      {showForm && (
        <>
          <div className="form-toggle"></div>
          {showForm && (
            <form className={`add-board-form ${showForm ? "show" : ""}`} onSubmit={handleBoardSubmit}>
              <input
                type="text"
                placeholder="Add a new board..."
                value={board}
                onChange={(e) => setBoard(e.target.value)}
              />
              <button type="submit">Add Board</button>
            </form>
          )}
        </>
      )}
    </header>
  );
}

const BOARDS = [
  { name: "fabiola", color: "#eab308" },
  { name: "ann", color: "#16a34a" },
  { name: "carline", color: "#0504aa" },
  { name: "erina", color: "#fb94dc" },
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewCardForm({ setCards, setShowForm, boards, selectedBoard }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [board, setBoard] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && board) {
      const newCard = {
        id: Math.round(Math.random() * 10000000),
        text,
        source,
        board,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      setCards((cards) => [newCard, ...cards]);

      setText("");
      setSource("");
      setBoard("");

      setShowForm(false);
    }
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share your inspiration..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
      />
      {selectedBoard !== null && (
        <select value={board} onChange={(e) => setBoard(e.target.value)}>
          <option value="">Choose a board</option>
          {boards.map((board) => (
            <option key={board.name} value={board.name}>
              {board.name.toUpperCase()}
            </option>
          ))}
        </select>
      )}
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function BoardFilter({ boards, handleExistingBoardToggle, handleAllBoardToggle, showAllBoards }) {
  return (
    <aside className="board-filter">
      <ul>
        <li className="board">
          <button className="btn btn-all-boards" onClick={handleAllBoardToggle}>
            All
          </button>
        </li>

        {showAllBoards && (
          <li className="board">
            {/* Add code to fetch all boards from the server */}
            {/* Example:
              fetch('/api/boards')
                .then((response) => response.json())
                .then((data) => setBoards(data));
            */}
          </li>
        )}

        {boards.map((board) => (
          <li className="board" key={board.name}>
            <button
              className="btn btn-board"
              style={{ backgroundColor: board.color }}
              onClick={() => handleExistingBoardToggle(board.name)}
            >
              {board.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Cardlist({ cards, boards, selectedBoard }) {
  const filteredCards = selectedBoard ? cards.filter((card) => card.board === selectedBoard) : cards;

  return (
    <section>
      <ul className="cards-list">
        {filteredCards.map((card) => (
          <Card key={card.id} card={card} boards={boards} />
        ))}
      </ul>
      <p>There are {filteredCards.length} inspirations here. Add your own!</p>
    </section>
  );
}

function Card({ card, boards }) {
  const board = boards.find((board) => board.name === card.board);

  return (
    <li className="card">
      <p>
        {card.text}
        <a
          className="source"
          href={card.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          (source)
        </a>
      </p>
      {board && (
        <span
          className="tag"
          style={{
            backgroundColor: board.color,
          }}
        >
          {board.name}
        </span>
      )}
      <div className="vote-buttons">
        <button>👍 {card.votesInteresting}</button>
        <button>🤯 {card.votesMindblowing}</button>
        <button>⛔️ {card.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
