'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md mx-4',
  md: 'max-w-2xl mx-4',
  lg: 'max-w-4xl mx-4',
  xl: 'max-w-6xl mx-4',
  full: 'max-w-[95vw] mx-2'
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300" />
      
      {/* Modal container */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} 
          max-h-[85vh] sm:max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-300
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header with close button */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-4">
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Additional modal components for common use cases

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}: ConfirmModalProps) {
  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      className="text-center"
    >
      <div className="py-4">
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 text-white rounded-lg transition-colors duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variantClasses[variant]}
            `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
}

export function LoadingModal({ isOpen, title, message = 'Please wait...' }: LoadingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing
      title={title}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEscape={false}
      className="text-center"
    >
      <div className="py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
