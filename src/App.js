import React, { useState } from "react";
import "./style.css";

const initialCards = [
  {
    id: 1,
    text: "Maybe the dingo ate your baby.",
    board: "fabiola",
    votesInteresting: 24,
  },
  {
    id: 2,
    text: "I wish I had a book for every book I have.",
    board: "ann",
    votesInteresting: 11,
  },
  {
    id: 3,
    text: "I'm not superstitious, but I am a little stitious.",
    board: "carline",
    votesInteresting: 8,
  },
  {
    id: 4,
    text: "I don't know where I'm going from here but I promise it won't be boring.",
    board: "erina",
    votesInteresting: 8,
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [boards, setBoards] = useState(BOARDS);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [advice, setAdvice] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);

  async function getAdvice() {
    try {
      const response = await fetch("https://api.adviceslip.com/advice");
      const data = await response.json();
      setAdvice(data.slip.advice);
    } catch (err) {
      console.log("Error fetching advice", err);
    }
  }

  const handleAdviceClick = () => {
    getAdvice();
  };

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

  const handleConfirmDelete = (cardId) => {
    setDeleteCardId(cardId);
    setShowConfirmation(true);
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      setCards((prevCards) => prevCards.filter((card) => card.id !== deleteCardId));
    }
    setShowConfirmation(false);
  };

  const handleIncrementLikes = (cardId, category) => {
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            [category]: card[category] + 1,
          };
        }
        return card;
      })
    );
  };

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
        <Cardlist
          cards={cards}
          boards={boards}
          selectedBoard={selectedBoard}
          handleConfirmDelete={handleConfirmDelete}
          handleIncrementLikes={handleIncrementLikes}
        />
      </main>

      <div className="advice">
        <div className="advice-left">
          <h2>Can't think of anything?</h2>
          <h2>Try the 'help' button.</h2>
        </div>
        <div className="advice-right">
          {advice && <h2>{advice}</h2>}
          <button className="btn btn-large advice-button" onClick={handleAdviceClick}>
            Help!
          </button>
        </div>
      </div>

      <ConfirmationDialog
        showConfirmation={showConfirmation}
        handleDeleteConfirmation={handleDeleteConfirmation}
      />
    </>
  );
}

function Header({ showForm, addBoard, handleFormToggle, handleNewBoardToggle, handleExistingBoardToggle }) {
  const appTitle = "In Your Face";
  const [board, setBoard] = useState("");

  const handleBoardSubmit = (event) => {
    event.preventDefault();

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
                onChange={(event) => setBoard(event.target.value)}
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

function NewCardForm({ setCards, setShowForm, boards, selectedBoard }) {
  const [text, setText] = useState("");
  const [board, setBoard] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (text && board) {
      const newCard = {
        id: Math.round(Math.random() * 10000000),
        text,
        board,
        votesInteresting: 0,
      };
      setCards((cards) => [newCard, ...cards]);

      setText("");
      setBoard("");

      setShowForm(false);
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Speak your truth..."
        value={text}
        onChange={handleTextChange}
        maxLength={40}
      ></input>
      <div className="char-counter">{charCount}/40</div>
      {selectedBoard !== null && (
        <select value={board} onChange={(event) => setBoard(event.target.value)}>
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

function Cardlist({ cards, boards, selectedBoard, handleConfirmDelete, handleIncrementLikes }) {
  const filteredCards = selectedBoard ? cards.filter((card) => card.board === selectedBoard) : cards;

  return (
    <section>
      <ul className="cards-list">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            boards={boards}
            handleConfirmDelete={handleConfirmDelete}
            handleIncrementLikes={handleIncrementLikes}
          />
        ))}
      </ul>
      <p>There are {filteredCards.length} inspirations here. Add your own!</p>
    </section>
  );
}

function Card({ card, boards, handleConfirmDelete, handleIncrementLikes }) {
  const board = boards.find((board) => board.name === card.board);

  const handleDeleteClick = () => {
    handleConfirmDelete(card.id);
  };

  const handleLikeClick = (category) => {
    handleIncrementLikes(card.id, category);
  };

  return (
    <li className="card">
      <p>{card.text}</p>
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
        <button onClick={() => handleLikeClick("votesInteresting")}>Likes: {card.votesInteresting}</button>
        <button onClick={handleDeleteClick}>⛔️ Delete</button>
      </div>
    </li>
  );
}

function ConfirmationDialog({ showConfirmation, handleDeleteConfirmation }) {
  return (
    <div className={`confirmation-dialog ${showConfirmation ? "show" : ""}`}>
      <div className="confirmation-content">
        <h2>Are you sure you want to delete this card?</h2>
        <div className="confirmation-actions">
          <button className="btn btn-delete" onClick={() => handleDeleteConfirmation(true)}>
            Yes, Delete
          </button>
          <button className="btn btn-cancel" onClick={() => handleDeleteConfirmation(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
