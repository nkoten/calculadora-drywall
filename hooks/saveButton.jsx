
import React from 'react';
import useOnlineStatus from './useOnlineStatus'; // Import the custom hook

export default function SaveButton() {
  const isOnline = useOnlineStatus(); // Use the custom hook

  return (
    <button disabled={!isOnline}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}


