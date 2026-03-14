"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Receipt, X, Check } from "lucide-react";
import type { EstablishmentType } from "@/shared/types";
import { getLabels } from "@/shared/lib/labels";

interface CallWaiterButtonProps {
  restaurantId: string;
  tableNumber: string;
  tableSessionId: string | null;
  establishmentType?: EstablishmentType;
}

type RequestType = "call_waiter" | "request_bill";

export default function CallWaiterButton({
  restaurantId,
  tableNumber,
  tableSessionId,
  establishmentType = "restaurant",
}: CallWaiterButtonProps) {
  const labels = getLabels(establishmentType);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequest = useCallback(
    async (type: RequestType) => {
      if (isSending || cooldown > 0) return;

      setIsSending(true);
      try {
        const res = await fetch("/api/menu/service-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            table_number: tableNumber,
            table_session_id: tableSessionId,
            type,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Erreur lors de l'envoi");
        }

        // Show success animation
        setShowSuccess(true);
        setIsOpen(false);

        // Start cooldown
        setCooldown(30);

        // Hide success after 2s
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Impossible d'envoyer la demande"
        );
      } finally {
        setIsSending(false);
      }
    },
    [restaurantId, tableNumber, tableSessionId, isSending, cooldown]
  );

  const isDisabled = cooldown > 0;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50">
      <AnimatePresence>
        {/* Sub-buttons (appear above the FAB) */}
        {isOpen && !isDisabled && (
          <>
            {/* Request bill button */}
            <motion.button
              key="request-bill"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              onClick={() => handleRequest("request_bill")}
              disabled={isSending}
              className="absolute bottom-[130px] left-0 flex items-center gap-2 bg-white text-gray-900 rounded-full pl-3 pr-4 h-11 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Receipt className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Demander l&apos;addition</span>
            </motion.button>

            {/* Call waiter button */}
            <motion.button
              key="call-waiter"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleRequest("call_waiter")}
              disabled={isSending}
              className="absolute bottom-[76px] left-0 flex items-center gap-2 bg-white text-gray-900 rounded-full pl-3 pr-4 h-11 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Bell className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Appeler le {labels.staffLabel}</span>
            </motion.button>
          </>
        )}

        {/* Success checkmark animation */}
        {showSuccess && (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute bottom-[76px] left-0 w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isDisabled) return;
          setIsOpen((prev) => !prev);
        }}
        disabled={isSending}
        className={[
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 relative",
          isDisabled
            ? "bg-gray-400 text-white cursor-not-allowed"
            : isOpen
              ? "bg-gray-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
        ].join(" ")}
        aria-label={
          isDisabled
            ? `Veuillez patienter ${cooldown}s`
            : isOpen
              ? "Fermer le menu"
              : `Appeler le ${labels.staffLabel}`
        }
      >
        <AnimatePresence mode="wait">
          {isDisabled ? (
            <motion.span
              key="cooldown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-xs font-bold tabular-nums"
            >
              {cooldown}s
            </motion.span>
          ) : isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bell"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bell className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop to close when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
