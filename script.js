let textHistory = []; 
let currentStateIndex = -1;
let draggedText = null;
let isDragging = false;
let offsetX, offsetY;
let selectedTextBox = null;  // Track the currently selected text box

// Function to add text and make it draggable
document.getElementById('addTextBtn').addEventListener('click', () => {
  const textDiv = document.createElement('div');
  textDiv.contentEditable = true;
  textDiv.textContent = "Move me!";
  textDiv.classList.add('draggable');
  
  // Set position and make the text draggable
  textDiv.style.position = "absolute";
  textDiv.style.left = "50px";
  textDiv.style.top = "50px";
  
  // Add it to the text area
  document.getElementById('textArea').appendChild(textDiv);
  
  // Event listeners to handle mouse events for dragging
  textDiv.addEventListener('mousedown', (e) => startDrag(e, textDiv));
  document.addEventListener('mousemove', (e) => drag(e));
  document.addEventListener('mouseup', () => stopDrag());

  // Add focus event to highlight selected text
  textDiv.addEventListener('focus', () => setSelectedTextBox(textDiv));

  // Save the new state
  saveState();
});

// Function to start dragging the text
function startDrag(e, element) {
  if (e.button !== 0) return;  // Only handle left mouse button
  isDragging = true;
  draggedText = element;
  
  // Calculate the offset of the mouse from the top-left corner of the element
  offsetX = e.clientX - draggedText.offsetLeft;
  offsetY = e.clientY - draggedText.offsetTop;
  draggedText.style.cursor = 'grabbing';  // Change cursor to grabbing
}

// Function to drag the text element
function drag(e) {
  if (isDragging && draggedText) {
    draggedText.style.left = `${e.clientX - offsetX}px`;
    draggedText.style.top = `${e.clientY - offsetY}px`;
  }
}

// Function to stop dragging
function stopDrag() {
  if (isDragging) {
    isDragging = false;
    draggedText.style.cursor = 'grab';  // Reset cursor back to grab
    saveState();
    draggedText = null;  // Clear dragged text reference
  }
}

// Undo and Redo functionality (same as before)
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

// Function to save the current state of the page
function saveState() {
  // Save the current content and all elements' states (position, text, styles)
  textHistory = textHistory.slice(0, currentStateIndex + 1);
  
  const textArea = document.getElementById('textArea');
  const elements = [...textArea.getElementsByClassName('draggable')];
  
  // Save the state of each draggable element
  const currentState = elements.map(el => ({
    content: el.textContent, // Text content
    position: { x: el.style.left, y: el.style.top }, // Position
    style: {
      fontWeight: el.style.fontWeight,
      fontStyle: el.style.fontStyle,
      textDecoration: el.style.textDecoration,
      fontSize: el.style.fontSize
    }
  }));
  
  // Add the state to history
  textHistory.push(currentState);
  currentStateIndex++;
}

// Function to restore a specific state
function restoreState() {
  const state = textHistory[currentStateIndex];
  const textArea = document.getElementById('textArea');
  
  // Clear the current content in the text area
  textArea.innerHTML = '';
  
  // Re-create each draggable text box based on the saved state
  state.forEach(elState => {
    const textDiv = document.createElement('div');
    textDiv.contentEditable = true;
    textDiv.textContent = elState.content;
    textDiv.classList.add('draggable');
    
    // Set the position and styles
    textDiv.style.position = 'absolute';
    textDiv.style.left = elState.position.x;
    textDiv.style.top = elState.position.y;
    textDiv.style.fontWeight = elState.style.fontWeight;
    textDiv.style.fontStyle = elState.style.fontStyle;
    textDiv.style.textDecoration = elState.style.textDecoration;
    textDiv.style.fontSize = elState.style.fontSize;
    
    // Add it to the text area
    textArea.appendChild(textDiv);
    
    // Re-add event listeners
    textDiv.addEventListener('mousedown', (e) => startDrag(e, textDiv));
    textDiv.addEventListener('focus', () => setSelectedTextBox(textDiv));
  });
}

// Function to set the selected text box and apply styles
function setSelectedTextBox(textDiv) {
  if (selectedTextBox !== textDiv) {
    if (selectedTextBox) {
      selectedTextBox.style.border = '';  // Remove border from previously selected box
    }
    selectedTextBox = textDiv;
    selectedTextBox.style.border = '2px solid blue';  // Add border to the newly selected box
  }
}

// Change Text Style (Bold, Italic, Underline)
function changeStyle(style) {
  if (selectedTextBox && selectedTextBox.contentEditable === "true") {
    if (style === 'bold') {
      selectedTextBox.style.fontWeight = selectedTextBox.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
    if (style === 'italic') {
      selectedTextBox.style.fontStyle = selectedTextBox.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
    if (style === 'underline') {
      selectedTextBox.style.textDecoration = selectedTextBox.style.textDecoration === 'underline' ? 'none' : 'underline';
    }
    
    saveState(); // Save state after applying styles
  }
}

// Change the size of the text
function changeSize() {
  if (selectedTextBox && selectedTextBox.contentEditable === "true") {
    let currentSize = parseInt(window.getComputedStyle(selectedTextBox).fontSize);
    let newSize = prompt("Enter new font size:", currentSize);
    if (newSize) {
      selectedTextBox.style.fontSize = `${newSize}px`;
      saveState(); // Save state after changing size
    }
  }
}
