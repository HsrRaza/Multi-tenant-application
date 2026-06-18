import React from 'react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-lg border border-brand-border bg-brand-card p-6 shadow-xl transition-all">
        <h3 className="text-lg font-medium leading-6 text-brand-text mb-2">{title}</h3>
        <p className="text-sm text-brand-muted mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
