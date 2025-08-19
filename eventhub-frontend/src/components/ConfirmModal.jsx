import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200">
    <h2 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
    <div className="flex justify-end gap-4">
      <button
        onClick={onClose}
        className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Confirm Delete
      </button>
    </div>
  </div>
</div>

  );
};

export default ConfirmModal;
