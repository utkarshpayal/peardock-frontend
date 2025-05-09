// @ts-nocheck

import { XCircle } from "lucide-react";

interface PaymentFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentFailedModal = ({ isOpen, onClose }: PaymentFailedModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[50]">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-semibold mt-4">Payment Failed</h2>
        <p className="text-gray-600 mt-2">Your transaction could not be completed. Please try again.</p>
        <button
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          onClick={onClose}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
