"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/shared/components/ui/card";
import { FadeIn } from "@/shared/components/animations";
import { JsonLd, generateFaqSchema } from "@/shared/components/JsonLd";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-2 text-left group"
      >
        <span className="font-medium text-slate-900 group-hover:text-[#3B82F6] transition-colors pr-4">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-600 px-2 pb-4 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const faqData: FAQItemProps[] = [
  {
    question: "Est-ce difficile a installer ?",
    answer:
      "Non, l'installation prend 5 minutes. Vous recevez un QR code par table a imprimer, et votre dashboard est pret immediatement.",
  },
  {
    question: "Le cadeau est-il conditionne a une note positive ?",
    answer:
      "Non, jamais. Conformement a la DGCCRF, chaque client tourne la roue quel que soit sa note. C'est ce qui rend les avis 100% authentiques.",
  },
  {
    question: "Mon personnel a-t-il besoin d'etre forme ?",
    answer:
      "Le systeme est intuitif : le client scanne, donne son avis, tourne la roue. Votre equipe n'a qu'a verifier l'ecran du gagnant.",
  },
  {
    question: "Puis-je personnaliser les cadeaux ?",
    answer:
      "Oui, entierement. Vous definissez les lots, leur probabilite et le nombre disponible depuis le dashboard.",
  },
  {
    question: "Les avis vont-ils directement sur Google ?",
    answer:
      "Le systeme verifie l'identite via Google OAuth et redirige le client vers Google Maps pour y deposer son avis.",
  },
  {
    question: "Que comprend la garantie ?",
    answer:
      "Si vous n'atteignez pas 50 avis Google en 60 jours, nous continuons gratuitement jusqu'a atteindre l'objectif.",
  },
];

export function FAQSection() {
  const faqSchema = generateFaqSchema(faqData);

  return (
    <section className="py-20 bg-[#f8fafc]">
      <JsonLd data={faqSchema} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Questions frequentes
            </h2>
            <p className="text-lg text-slate-600">
              Tout ce que vous devez savoir
            </p>
          </div>
        </FadeIn>

        {/* FAQ List */}
        <FadeIn delay={0.2}>
          <Card className="bg-white p-6">
            {faqData.map((item) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
