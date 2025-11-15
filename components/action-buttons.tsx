"use client";

import { Button } from '@/components/ui/button';

export default function ActionButtons() {
  function handleAction(kind: 'primary' | 'secondary') {
    console.log('Placeholder action:', kind);
  }

  function addRipple(e: React.MouseEvent<HTMLDivElement>) {
    const container = e.currentTarget as HTMLDivElement;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    container.appendChild(ripple);
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  return (
    <div className="action-stack">
      <div className="ripple-container" onClick={(e) => { addRipple(e); handleAction('primary'); }}>
        <Button className="w-full button-tall" variant="default">
          Primary action
        </Button>
      </div>
      <div className="ripple-container" onClick={(e) => { addRipple(e); handleAction('secondary'); }}>
        <Button className="w-full button-tall" variant="outline">
          Secondary
        </Button>
      </div>
    </div>
  );
}
