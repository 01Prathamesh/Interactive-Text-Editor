let textHistory = [];
let currentStateIndex = -1;
let isDragging = false;
let draggedText = null;
let offsetX, offsetY;
let selectedTextBox = null;

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
  
  // Add it to the text area
  document.getElementById('textArea').appendChild(textDiv);
  
  // Attach drag events to the newly created text div
  addDragEventListeners(textDiv);
  
  // Save the current state
  saveState();
});

// Function to add drag event listeners to a new element
function addDragEventListeners(element) {
  element.addEventListener('mousedown', (e) => startDrag(e, element));
  element.addEventListener('focus', () => setSelectedTextBox(element));
}

// Function to start dragging the text
function startDrag(e, element) {
  if (e.button !== 0) return; // Only handle left mouse button
  isDragging = true;
  draggedText = element;
  
  // Calculate the offset of the mouse from the top-left corner of the element
  offsetX = e.clientX - draggedText.offsetLeft;
  offsetY = e.clientY - draggedText.offsetTop;
  
  draggedText.style.cursor = 'grabbing'; // Change cursor to grabbing
}

// Function to drag the text element
document.addEventListener('mousemove', (e) => {
  if (isDragging && draggedText) {
    draggedText.style.left = `${e.clientX - offsetX}px`;
    draggedText.style.top = `${e.clientY - offsetY}px`;
  }
});

// Function to stop dragging
document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    draggedText.style.cursor = 'grab'; // Reset cursor back to grab
    saveState(); // Save the current state after drag ends
    draggedText = null; // Clear dragged text reference
  }
});

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

// Function to save the current state of the page
function saveState() {
  // Slice the history to remove any states after the current index (undo functionality)
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
  
  // Push the current state to history and increment the state index
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
    
    // Re-add drag event listeners
    addDragEventListeners(textDiv);
  });
}

// Function to set the selected text box and apply styles
function setSelectedTextBox(textDiv) {
  if (selectedTextBox !== textDiv) {
    if (selectedTextBox) {
      selectedTextBox.style.border = ''; // Remove border from previously selected box
    }
    selectedTextBox = textDiv;
    selectedTextBox.style.border = '2px solid blue'; // Add border to the newly selected box
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
    if (newSize && !isNaN(newSize)) {
      selectedTextBox.style.fontSize = `${newSize}px`;
      saveState(); // Save state after changing size
    }
  }
}
