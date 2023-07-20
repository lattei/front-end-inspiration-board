import React from "react";

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

    export default ConfirmationDialog;