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

  const addBoard = async (newBoard) => {
    try {
      const response = await axios.post("/boards", newBoard);
      const createdBoard = response.data;
      setBoards((prevBoards) => [...prevBoards, createdBoard]);
    } catch (error) {
      console.log("Error creating board", error);
    }
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

  const handleDeleteConfirmation = async (confirmed) => {
    if (confirmed) {
      try {
        await axios.delete(`/cards/${deleteCardId}`);
        setCards((prevCards) => prevCards.filter((card) => card.id !== deleteCardId));
      } catch (error) {
        console.log("Error deleting card", error);
      }
    }
    setShowConfirmation(false);
  };

  const handleIncrementLikes = async (cardId) => {
    try {
      await axios.patch(`/cards/${cardId}/incrementLikes`);
      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              likes: card.likes + 1,
            };
          }
          return card;
        })
      );
    } catch (error) {
      console.log("Error incrementing likes", error);
    }
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

      {showForm && (
        <NewCardForm
          setCards={setCards}
          setShowForm={setShowForm}
          boards={boards}
          selectedBoard={selectedBoard}
        />
      )}

      <main className="main">
        <BoardFilter
          boards={boards}
          handleExistingBoardToggle={handleExistingBoardToggle}
          handleAllBoardToggle={() => setSelectedBoard("")}
          showAllBoards={!selectedBoard}
        />
        <CardList
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
  const appTitle = "In Your Face";
  const [board, setBoard] = useState("");

  const handleBoardSubmit = async (event) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (text && board) {
      const newCard = {
        text,
        board,
        likes: 0,
      };

      try {
        const response = await axios.post("/cards", newCard);
        const createdCard = response.data;
        setCards((prevCards) => [createdCard, ...prevCards]);

        setText("");
        setBoard("");
        setShowForm(false);
      } catch (error) {
        console.log("Error creating card", error);
      }
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
      />
      {selectedBoard !== null && (
        <select value={board} onChange={(event) => setBoard(event.target.value)}>
          <option value="">Choose a board</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
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
            {boards.map((board) => (
              <button
                key={board.id}
                className="btn btn-board"
                style={{ backgroundColor: board.color }}
                onClick={() => handleExistingBoardToggle(board.id)}
              >
                {board.name}
              </button>
            ))}
          </li>
        )}
      </ul>
    </aside>
  );
}

function CardList({ cards, boards, selectedBoard, handleConfirmDelete, handleIncrementLikes }) {
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
  const selectedBoard = boards.find((board) => board.id === card.board);

  const handleDeleteClick = () => {
    handleConfirmDelete(card.id);
  };

  const handleLikeClick = () => {
    handleIncrementLikes(card.id);
  };

  return (
    <li className="card">
      <p>{card.text}</p>
      {selectedBoard && (
        <span
          className="tag"
          style={{
            backgroundColor: selectedBoard.color,
          }}
        >
          {selectedBoard.name}
        </span>
      )}
      <div className="vote-buttons">
        <button onClick={handleLikeClick}>👍 {card.likes}</button>
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
