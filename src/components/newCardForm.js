import React, { useState } from "react";

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

const characterCount = text.length;
const maxCharacterCount = 40 - characterCount;

return (
    <form className="card-form" onSubmit={handleSubmit}>
    <input
        type="text"
        placeholder="Speak your truth..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={40}
    ></input>

    <div className="character-counter">
        {maxCharacterCount} characters remaining
    </div>
    {selectedBoard !== null && (
        <select
        value={board}
        onChange={(event) => setBoard(event.target.value)}
        >
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

export default NewCardForm;
