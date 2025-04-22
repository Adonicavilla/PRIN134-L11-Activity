const gameArea = document.getElementById('gameArea');
const target = document.getElementById('target');
const scoreBoard = document.getElementById('scoreBoard');

let score = 0;

function moveTarget() {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const maxX = gameAreaRect.width - target.offsetWidth;
  const maxY = gameAreaRect.height - target.offsetHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;
}

moveTarget();


target.addEventListener('click', function() {
  score++;
  
  scoreBoard.textContent = `Score: ${score}`;
  moveTarget();
});

window.addEventListener('resize', function() {
  moveTarget();
});


function resetGame() {
    score = 0;
    scoreBoard.textContent = `Score: ${score}`;
    moveTarget();
  }
// Add keyboardkey reset the game
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'h' || e.key === 'H')) {
      e.preventDefault(); 
      resetGame();
    }
  });