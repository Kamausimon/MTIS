import React, { useState } from 'react';
import './App.css';
import Button from './components/Button';

function App() {
  // Add state to track clicks
  const [clickCount, setClickCount] = useState(0);
  const [buttonText, setButtonText] = useState('Click me');

  const handleClick = () => {
    console.log('Button clicked');
    setClickCount(prev => prev + 1);
    setButtonText(`Clicked ${clickCount + 1} times!`);
  };

  // Add error boundary
  const handleError = (error) => {
    console.error('Button error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-gray-800 text-white text-center p-4">
        <h1 className="text-2xl">React App</h1>
        <div className="mt-4">
          <Button 
            onClick={handleClick} 
            onError={handleError}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {buttonText}
          </Button>
          {clickCount > 0 && (
            <p className="mt-2 text-sm">Total clicks: {clickCount}</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
