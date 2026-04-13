import confetti from 'canvas-confetti';

export function fireMatchConfetti() {
  confetti({
    particleCount: 60,
    spread: 55,
    origin: { y: 0.6 },
    colors: ['#ff6b35', '#ffe66d', '#06d6a0', '#7b5ea7', '#4ecdc4'],
    scalar: 0.9,
  });
}

export function fireWinConfetti() {
  const end = Date.now() + 1500;
  const colors = ['#ff6b35', '#ffe66d', '#06d6a0', '#7b5ea7', '#4ecdc4'];

  function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  }

  frame();
}
