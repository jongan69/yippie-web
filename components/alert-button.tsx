import React from 'react';

const AlertButton = () => {
    const showAlert = () => {
        alert('Hello, this is your alert message!');
    };

    return (
        <button onClick={showAlert}>Click me to alert</button>
    );
};

export default AlertButton;