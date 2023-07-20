import React from "react";

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
            <button onClick={() => handleLikeClick("votesInteresting")}> 👍 Likes: {card.votesInteresting}</button>
            <button onClick={handleDeleteClick}>⛔️ Delete</button>
            </div>
        </li>
        );
    }

export default Card;