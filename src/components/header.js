import React, { useState } from "react";

function Header({ showForm, setShowForm, addBoard, handleFormToggle, handleNewBoardToggle, handleExistingBoardToggle }) {
    const appTitle = "Everything I Know, I Got From...";
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


export default Header;