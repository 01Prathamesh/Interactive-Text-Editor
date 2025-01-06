let textHistory = [];
let currentStateIndex = -1;
let isDragging = false;
let draggedText = null;
let offsetX, offsetY;
let selectedTextBox = null;
let isDarkMode = false;

// Function to toggle dark mode
document.getElementById('darkModeToggle').addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
});

// Function to add text and make it draggable
document.getElementById('addTextBtn').addEventListener('click', () => {
  const textDiv = document.createElement('div');
  textDiv.contentEditable = true;
  textDiv.textContent = "Move me!";
  textDiv.classList.add('draggable');
  
  // Set initial position for the draggable element
  textDiv.style.position = 'absolute';
  textDiv.style.left = '50px';
  textDiv.style.top = '50px';
  
  // Add to the text area
  document.body.appendChild(textDiv);

  // Save current state for undo/redo
  saveState();
});

// Function to handle dragging of text
document.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('draggable')) {
    draggedText = e.target;
    isDragging = true;
    offsetX = e.clientX - draggedText.getBoundingClientRect().left;
    offsetY = e.clientY - draggedText.getBoundingClientRect().top;
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDragging && draggedText) {
    draggedText.style.left = `${e.clientX - offsetX}px`;
    draggedText.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  draggedText = null;
});

// Change Text Style (Bold, Italic, Underline, etc.)
function changeStyle(style) {
  document.execCommand(style, false, null);
  saveState();
}

// Change Font Size
function changeSize() {
  const currentSize = parseInt(document.getElementById('textArea').style.fontSize || '16px');
  document.getElementById('textArea').style.fontSize = `${currentSize + 2}px`;
  saveState();
}

// Change Font Family
function changeFont() {
  const fontFamily = prompt("Enter font family (e.g., Arial, Times New Roman, etc.)");
  document.getElementById('textArea').style.fontFamily = fontFamily;
  saveState();
}

// Change Text Color
function changeTextColor() {
  const color = prompt("Enter color (e.g., #ff5733, red, etc.)");
  document.getElementById('textArea').style.color = color;
  saveState();
}

// Change Background Color
function changeBackgroundColor() {
  const color = prompt("Enter background color (e.g., #ff5733, lightgray, etc.)");
  document.getElementById('textArea').style.backgroundColor = color;
  saveState();
}

// Undo and Redo functionality
document.getElementById('undoBtn').addEventListener('click', () => {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    restoreState();
  }
});

document.getElementById('redoBtn').addEventListener('click', () => {
  if (currentStateIndex < textHistory.length - 1) {
    currentStateIndex++;
    restoreState();
  }
});

// Save current state for undo/redo functionality
function saveState() {
  textHistory = textHistory.slice(0, currentStateIndex + 1); // Remove future redo states
  textHistory.push(document.getElementById('textArea').innerHTML);
  currentStateIndex++;
}

// Restore a saved state
function restoreState() {
  document.getElementById('textArea').innerHTML = textHistory[currentStateIndex];
}

// Export as PDF
document.getElementById('exportPdfBtn').addEventListener('click', () => {
  const doc = new jsPDF();
  doc.text(document.getElementById('textArea').innerText, 10, 10);
  doc.save('document.pdf');
});
