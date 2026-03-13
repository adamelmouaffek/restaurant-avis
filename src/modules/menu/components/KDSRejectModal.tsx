"use client";

import { useState } from "react";

interface KDSRejectModalProps {
  orderId: string;
  tableNumber: string;
  onConfirm: (orderId: string, reason: string) => void;
  onClose: () => void;
}

export function KDSRejectModal({
  orderId,
  tableNumber,
  onConfirm,
  onClose,
}: KDSRejectModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    onConfirm(orderId, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-white mb-1">
          Rejeter la commande
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Table {tableNumber} — Commande #{orderId.slice(0, 8)}
        </p>

        <label className="block text-sm font-medium text-gray-300 mb-2">
          Raison du refus <span className="text-red-400">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: ingredient indisponible, cuisine fermee..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          rows={3}
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || submitting}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Envoi..." : "Confirmer le refus"}
          </button>
        </div>
      </div>
    </div>
  );
}
