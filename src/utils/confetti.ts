import confetti from 'canvas-confetti';

export function fireCoinConfetti() {
  confetti({
    particleCount: 45,
    spread: 60,
    origin: { y: 0.75 },
    colors: ['#FACC15', '#F59E0B', '#A855F7', '#EAB308', '#FFFFFF']
  });
}

export function fireBigWithdrawConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FACC15', '#9333EA', '#10B981']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FACC15', '#9333EA', '#10B981']
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
