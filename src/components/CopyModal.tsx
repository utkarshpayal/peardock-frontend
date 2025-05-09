// @ts-nocheck

import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretKey: string;
}

const CopyModal: React.FC<CopyModalProps> = ({
  isOpen,
  onClose,
  secretKey,
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const clearParams = () => {
    navigate(window.location.pathname, { replace: true });
  };
  const handleDownload = ({ key }: any) => {
    const blob = new Blob([key], { type: "text/plain" });
    const link = document.createElement("a");

    link.download = "supersecretkey.txt";

    link.href = URL.createObjectURL(blob);

    link.click();
  };
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20   bg-opacity-20 flex items-center justify-center p-4 z-[50]">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={() => {
            clearParams();
            onClose();
          }}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Secret Key</h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please store this key safely. You won't be able to see it
                  again!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-md flex items-center justify-between mb-4">
            <code className="font-mono text-sm break-all">{secretKey}</code>
            <button
              onClick={() => handleCopy(secretKey)}
              className="ml-2 p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-200"
              aria-label="Copy secret key"
            >
              {copied ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>This key grants access to your account's sensitive data.</p>
            <p>If you lose this key, you'll need to generate a new one.</p>
          </div>

          <button
            onClick={() => {
              handleDownload({ key: secretKey });
              clearParams();
            }}
            className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 
                     transition-colors duration-200"
          >
            Save the Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyModal;
