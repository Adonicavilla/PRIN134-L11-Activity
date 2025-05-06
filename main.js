const gameArea = document.getElementById('gameArea');
const scoreBoard = document.getElementById('scoreBoard');
let totalScore = 0;
let currentSequenceProgress = 0;
let targets = [];

function init() {
  const controlsDiv = document.createElement('div');
  controlsDiv.style.textAlign = 'center';
  controlsDiv.style.margin = '20px 0';
  
  const inputBox = document.createElement('input');
  inputBox.type = 'number';
  inputBox.value = '3';
  inputBox.min = '1';
  
  const setupBtn = document.createElement('button');
  setupBtn.textContent = 'Setup';
  setupBtn.onclick = () => {
    const num = parseInt(inputBox.value);
    if (num > 0) {
      totalScore = 0; 
    }
  };
  
  controlsDiv.innerHTML = '<div style="font-weight:bold">Number of Targets</div>';
  controlsDiv.appendChild(inputBox);
  controlsDiv.appendChild(setupBtn);
  gameArea.parentNode.insertBefore(controlsDiv, gameArea);
  
  // Add styles
  document.head.appendChild(createStyles());
  
  // Prevent default context menu on the entire game area
  gameArea.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  }, false);
  
  // Start with default targets
  setupTargets(3);
  
  // Add keyboard reset
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === 'h' || e.key === 'H')) {
      e.preventDefault();
      resetGame();
    }
  });
}

// Create targets based on input
function setupTargets(numTargets) {
  clearTargets();
  
  for (let i = 0; i < numTargets; i++) {
    const target = createTarget(i + 1);
    gameArea.appendChild(target);
    targets.push(target);
  }
  
  currentSequenceProgress = 0;
  
  // Activate first target
  if (targets.length > 0) {
    targets[0].classList.add('active');
    targets[0].style.cursor = 'context-menu';
  }
  
  updateScoreboard();
}

// Create a single target
function createTarget(number) {
  const target = document.createElement('div');
  target.className = 'target';
  target.textContent = number;
  positionTarget(target);
  
  //right-click (contextmenu event)
  target.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Right-clicked on target ${this.textContent}`);
    
    const targetNumber = parseInt(this.textContent);
    if (targetNumber === currentSequenceProgress + 1) {
      handleTargetClick(this);
    }
    
    return false;
  }, false);
  
  return target;
}

function handleTargetClick(targetElement) {

  // Increment progress
  currentSequenceProgress++;
  updateScoreboard();
  
  if (targetElement.parentNode === gameArea) {
    gameArea.removeChild(targetElement);
  }
  if (currentSequenceProgress >= targets.length) {
    totalScore++;
    showMessage("Sequence Complete! +1 Point", "success");
    
    // Start new sequence 
    setTimeout(() => {
      const num = parseInt(document.querySelector('input').value) || 3;
      setupTargets(num);
    }, 1000);
  } else {
    // Activate next target
    targets[currentSequenceProgress].classList.add('active');
    targets[currentSequenceProgress].style.cursor = 'context-menu';
  }
}

// Position randomly
function positionTarget(target) {
  const size = 40;
  const rect = gameArea.getBoundingClientRect();
  const maxX = rect.width - size;
  const maxY = rect.height - size;
  
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

// Show message
function showMessage(text, type) {
  const msg = document.createElement('div');
  msg.textContent = text;
  
  Object.assign(msg.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '15px 25px',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: '100',
    color: 'white',
    backgroundColor: type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)'
  });
  
  gameArea.appendChild(msg);
  setTimeout(() => {
    if (msg.parentNode === gameArea) {
      gameArea.removeChild(msg);
    }
  }, 1000);
}

// Update scoreboard
function updateScoreboard() {
  scoreBoard.textContent = `Total Score: ${totalScore} `;
}

// Clear all targets
function clearTargets() {
  targets.forEach(target => {
    if (target.parentNode === gameArea) {
      gameArea.removeChild(target);
    }
  });
  targets = [];
}

// Reset game
function resetGame() {
  totalScore = 0;
  currentSequenceProgress = 0;
  
  const num = parseInt(document.querySelector('input').value) || 3;
  setupTargets(num);
}

// Create CSS styles
function createStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .target.active {
      box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.7);
      animation: pulse 1.5s infinite;
      background-color: #ff9900 !important;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    button {
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 5px;
    }
    
    button:hover {
      background-color: #e0e0e0;
    }
    
    input {
      width: 60px;
      margin: 5px;
    }
  `;
  return style;
}

// Initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}