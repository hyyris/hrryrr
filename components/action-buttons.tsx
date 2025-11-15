"use client";

import { Button } from '@/components/ui/button';

type ActionButtonsProps = {
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  disabled?: boolean;
  primaryDelta?: number;
  secondaryDelta?: number;
};

export default function ActionButtons({ onPrimary, onSecondary, primaryLabel = 'Primary action', secondaryLabel = 'Secondary', disabled, primaryDelta, secondaryDelta }: ActionButtonsProps) {

  function addRipple(e: React.MouseEvent<HTMLDivElement>, host: HTMLDivElement) {
    const container = host.querySelector('.ripple-container') as HTMLDivElement | null;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.2;
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    container.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  function addDelta(e: React.MouseEvent<HTMLDivElement>, host: HTMLDivElement, delta?: number) {
    if (delta == null) return;
    const rect = host.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = document.createElement('span');
    el.className = 'delta-float';
  const sign = delta > 0 ? '+' : delta < 0 ? '-' : '';
    const formatted = Math.abs(delta).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    el.textContent = `${sign}${formatted}€`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.dataset.type = delta > 0 ? 'gain' : delta < 0 ? 'loss' : 'neutral';
    host.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  return (
    <div className="action-stack">
      <div
        className="delta-host"
        onClick={(e) => {
          const host = e.currentTarget as HTMLDivElement;
          addRipple(e, host);
          addDelta(e, host, primaryDelta);
          onPrimary?.();
        }}
      >
        <div className="ripple-container">
          <Button className="w-full button-tall" variant="default" disabled={disabled}>
            {primaryLabel}
          </Button>
        </div>
      </div>
      <div
        className="delta-host"
        onClick={(e) => {
          const host = e.currentTarget as HTMLDivElement;
          addRipple(e, host);
          addDelta(e, host, secondaryDelta);
          onSecondary?.();
        }}
      >
        <div className="ripple-container">
          <Button className="w-full button-tall" variant="outline" disabled={disabled}>
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
