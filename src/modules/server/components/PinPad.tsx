"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Delete, LogIn } from "lucide-react";

interface PinPadProps {
  onSubmit: (pin: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function PinPad({ onSubmit, isLoading, error }: PinPadProps) {
  const [pin, setPin] = useState("");

  const handleDigit = useCallback((digit: string) => {
    setPin((prev) => (prev.length < 4 ? prev + digit : prev));
  }, []);

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (pin.length === 4) {
      onSubmit(pin);
    }
  }, [pin, onSubmit]);

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* PIN dots */}
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
              i < pin.length
                ? "bg-blue-500 border-blue-500"
                : "bg-transparent border-gray-500"
            }`}
            animate={i < pin.length ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      {/* Error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {digits.map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            disabled={isLoading}
            className="h-16 rounded-xl bg-white/10 text-white text-2xl font-semibold hover:bg-white/20 active:bg-white/30 active:scale-95 transition-all duration-150 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: backspace, 0, submit */}
        <button
          onClick={handleBackspace}
          disabled={isLoading || pin.length === 0}
          className="h-16 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-150 disabled:opacity-30"
          aria-label="Effacer"
        >
          <Delete className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleDigit("0")}
          disabled={isLoading}
          className="h-16 rounded-xl bg-white/10 text-white text-2xl font-semibold hover:bg-white/20 active:bg-white/30 active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          0
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading || pin.length !== 4}
          className="h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Valider"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogIn className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
