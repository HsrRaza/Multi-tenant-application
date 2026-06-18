import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-brand-border bg-brand-card/30 p-8 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-brand-card p-3 text-brand-primary">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="mb-1 text-base font-semibold text-brand-text">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-brand-muted">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
