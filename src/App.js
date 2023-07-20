import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [cards, setCards] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [advice, setAdvice] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortOption, setSortOption] = useState("likes");

  useEffect(() => {
    fetchCards();
    fetchBoards();
  }, []);

  async function fetchCards() {
    try {
      const response = await axios.get("/cards");
      setCards(response.data);
    } catch (error) {
      console.log("Error fetching cards", error);
    }
  }

  async function fetchBoards() {
    try {
      const response = await axios.get("/boards");
      setBoards(response.data);
    } catch (error) {
      console.log("Error fetching boards", error);
    }
  }

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

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredCards = selectedBoard ? cards.filter((card) => card.board === selectedBoard) : cards;

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortOption === "likes") {
      if (sortOrder === "asc") {
        return a.votesInteresting - b.votesInteresting;
      } else {
        return b.votesInteresting - a.votesInteresting;
      }
    } else if (sortOption === "id") {
      if (sortOrder === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    }
    return 0;
  });

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

      {showForm && (
        <NewCardForm
          setCards={setCards}
          setShowForm={setShowForm}
          boards={boards}
          selectedBoard={selectedBoard}
        />
      )}

      <main className="main">
        <section className="board-filter">
          <ul>
            <li className="board">
              <button className="btn btn-all-boards" onClick={() => setSelectedBoard("")}>
                All
              </button>
            </li>
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
        </section>
        <section>
          <div className="sort-options">
            <label>
              Sort by:
              <select value={sortOption} onChange={handleSortOptionChange} className="select-menu">
                <option value="likes"> Likes </option>
                <option value="id"> ID </option>
              </select>
            </label>
            <label>
              Sort order:
              <select value={sortOrder} onChange={handleSortOrderChange} className="select-menu">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </label>
            <p className="count">There are {filteredCards.length} inspirations here. Add your own!</p>
          </div>

          <ul className="cards-list">
            {sortedCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                boards={boards}
                handleConfirmDelete={handleConfirmDelete}
                handleIncrementLikes={handleIncrementLikes}
              />
            ))}
          </ul>
        </section>
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

      {showConfirmation && (
        <ConfirmationDialog
          showConfirmation={showConfirmation}
          handleDeleteConfirmation={handleDeleteConfirmation}
        />
      )}
    </>
  );
}

function Header({ showForm, setShowForm, addBoard, handleFormToggle, handleNewBoardToggle, handleExistingBoardToggle }) {
  const appTitle = "Everything I've Learned, I Got From...";
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
        <img src="logo.png" alt="Everything I've Learned logo" />
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

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Speak your truth..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={40}
      ></input>
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
