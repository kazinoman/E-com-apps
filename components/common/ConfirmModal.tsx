"use client";

import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-[400px] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-[17px] font-bold text-[#333333] dark:text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="text-[#333333] hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[14px] text-[#8C93A3] mb-8">{message}</p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-transparent text-[#333333] dark:text-white py-3 rounded-lg text-[14px] font-bold transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-[14px] font-bold transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
