// Animate percentage counter
const percentageElement = document.getElementById('percentage');
let percentageValue = 0;

function updatePercentage() {
  if (percentageValue <= 99) {
    percentageValue++;
    percentageElement.textContent = percentageValue + '%';

    // Variable speed - slower at start and end
    let timeout = 50;
    if (percentageValue < 20 || percentageValue > 80) {
      timeout = 80;
    }

    setTimeout(updatePercentage, timeout);
  } else {
    // Reset to 0% after reaching 100%
    setTimeout(() => {
      percentageValue = 0;
      percentageElement.textContent = percentageValue + '%';
      updatePercentage();
    }, 1000);
  }
}

// Create falling leaves
const leavesContainer = document.getElementById('leaves-container');
const numberOfLeaves = 20;

for (let i = 0; i < numberOfLeaves; i++) {
  const leaf = document.createElement('div');
  leaf.classList.add('leaf');

  // Random positioning and animations
  const leftPos = Math.random() * 100;
  const size = Math.random() * 15 + 10;
  const opacity = Math.random() * 0.5 + 0.3;
  const duration = Math.random() * 10 + 15;
  const delay = Math.random() * 15;

  leaf.style.left = `${leftPos}%`;
  leaf.style.width = `${size}px`;
  leaf.style.height = `${size}px`;
  leaf.style.opacity = opacity;
  leaf.style.animationDuration = `${duration}s`;
  leaf.style.animationDelay = `${delay}s`;

  // Randomize leaf colors
  const colors = [
    'rgba(76, 175, 80, 0.5)',
    'rgba(46, 125, 50, 0.5)',
    'rgba(129, 199, 132, 0.5)'
  ];
  const greenShade = Math.floor(Math.random() * colors.length);
  leaf.style.backgroundColor = colors[greenShade];

  leavesContainer.appendChild(leaf);
}

// Start animations when page loads
window.onload = function () {
  updatePercentage();
};
