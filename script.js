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
  
// Undo functionality
document.getElementById('undoBtn').addEventListener('click', () => {
    if (currentStateIndex > 0) {
      currentStateIndex--;
      restoreState();
    }
});
  