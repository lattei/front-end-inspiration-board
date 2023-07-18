import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [cards, setCards] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await axios.get("/cards");
        setCards(response.data);
      } catch (error) {
        console.log("Error fetching cards", error);
      }
    }
    fetchCards();
  }, []);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await axios.get("/boards");
        setBoards(response.data);
      } catch (error) {
        console.log("Error fetching boards", error);
      }
    }
    fetchBoards();
  }, []);

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

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await axios.delete(`/cards/${cardId}`);
        setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
      } catch (error) {
        console.log("Error deleting card", error);
      }
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

      {showForm ? (
        <NewCardForm
          setCards={setCards}
          setShowForm={setShowForm}
          boards={boards}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
        />
      ) : null}

      <main className="main">
        <BoardFilter
          boards={boards}
          handleExistingBoardToggle={handleExistingBoardToggle}
          handleAllBoardToggle={() => setSelectedBoard("")}
          showAllBoards={!selectedBoard}
        />
        <Cardlist cards={cards} boards={boards} selectedBoard={selectedBoard} handleDeleteCard={handleDeleteCard} />
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
    </>
  );
}

function Header({ showForm, setShowForm, boards, addBoard, handleFormToggle, handleNewBoardToggle, handleExistingBoardToggle }) {
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

function NewCardForm({ setCards, setShowForm, boards, selectedBoard, setSelectedBoard }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [board, setBoard] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (text && isValidHttpUrl(source) && board) {
      const newCard = {
        text,
        source,
        board,
      };

      try {
        const response = await axios.post("/cards", newCard);
        const createdCard = response.data;
        setCards((prevCards) => [createdCard, ...prevCards]);

        setText("");
        setSource("");
        setBoard("");
        setShowForm(false);
      } catch (error) {
        console.log("Error creating card", error);
      }
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
        maxLength={200}
      ></input>
      <div className="char-counter">{charCount}/200</div>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(event) => setSource(event.target.value)}
      />
      {selectedBoard !== null && (
        <select value={board} onChange={(event) => setBoard(event.target.value)}>
          <option value="">Choose a board</option>
          {boards.map((board) => (
            <option key={board._id} value={board._id}>
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
                key={board._id}
                className="btn btn-board"
                style={{ backgroundColor: board.color }}
                onClick={() => handleExistingBoardToggle(board._id)}
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

function Cardlist({ cards, boards, selectedBoard, handleDeleteCard }) {
  const filteredCards = selectedBoard ? cards.filter((card) => card.board === selectedBoard) : cards;

  return (
    <section>
      <ul className="cards-list">
        {filteredCards.map((card) => (
          <Card key={card._id} card={card} boards={boards} handleDeleteCard={handleDeleteCard} />
        ))}
      </ul>
      <p>There are {filteredCards.length} inspirations here. Add your own!</p>
    </section>
  );
}

function Card({ card, boards, handleDeleteCard }) {
  const selectedBoard = boards.find((board) => board._id === card.board);

  const handleCardDelete = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      handleDeleteCard(card._id);
    }
  };

  return (
    <li className="card">
      <p>
        {card.text}
        <a className="source" href={card.source} target="_blank" rel="noopener noreferrer">
          (source)
        </a>
      </p>
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
        <button>👍 Like!{card.likes}</button>
        <button>⛔️ Delete this card.</button>
      </div>
      <button className="btn btn-delete" onClick={handleCardDelete}>
        Delete
      </button>
    </li>
  );
}

export default App;
