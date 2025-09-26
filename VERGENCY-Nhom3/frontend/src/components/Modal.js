import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ title, message, show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>{title}</h4>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                {children && <div className="modal-footer">{children}</div>}
            </div>
        </div>
    );
};

export default Modal;