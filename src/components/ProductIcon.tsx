import type { CSSProperties } from 'react';
import type { KortexApp } from '../data/apps';
import styles from './ProductIcon.module.css';

interface ProductIconProps {
  app: KortexApp;
  className?: string;
}

export function ProductIcon({ app, className = '' }: ProductIconProps) {
  if (app.icon) return <img src={app.icon} alt="" className={className} />;

  return (
    <span
      className={`${styles.mark} ${className}`}
      style={{ '--mark-accent': app.accent, '--mark-accent-rgb': app.accentRgb } as CSSProperties}
      aria-hidden="true"
    >
      <span>{app.glyph}</span>
    </span>
  );
}