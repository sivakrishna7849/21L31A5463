const express = require('express');
const app = express();
const port = 9876;

const windowSize = 10;
let currentWindow = [];

// Mock data to replace the fetchNumbers function
const mockData = {
  'p': [2, 3, 5, 7, 11],    // Prime numbers
  'f': [1, 1, 2, 3, 5],     // Fibonacci numbers
  'e': [2, 4, 6, 8, 10],    // Even numbers
  'r': [6, 9, 12, 15, 18]   // Random numbers
};

// Utility function to check if the number ID is valid
const isValidNumberID = (id) => {
  return ['p', 'f', 'e', 'r'].includes(id);
};

// Utility function to check if an item is in an array
const contains = (array, item) => {
  return array.indexOf(item) !== -1;
};

// Function to update the window with new numbers
const updateWindow = (newNumbers) => {
  const previousWindow = [...currentWindow];
  newNumbers.forEach(num => {
    if (!contains(currentWindow, num)) {
      if (currentWindow.length >= windowSize) {
        currentWindow.shift();
      }
      currentWindow.push(num);
    }
  });
  return { previousWindow, currentWindow };
};

// Function to calculate the average
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const total = numbers.reduce((acc, num) => acc + num, 0);
  return (total / numbers.length).toFixed(2);
};

// Request handler
app.get('/numbers/:numberID', (req, res) => {
  const numberID = req.params.numberID.toLowerCase();

  if (!isValidNumberID(numberID)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const numbers = mockData[numberID];
  if (!numbers) {
    return res.status(400).json({ error: 'Numbers not found for given ID' });
  }

  const { previousWindow, currentWindow } = updateWindow(numbers);
  const average = calculateAverage(currentWindow);

  const response = {
    numbers: numbers,
    windowPrevState: previousWindow,
    windowCurrState: currentWindow,
    avg: parseFloat(average)
  };

  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
