"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-primary" />
        Frequently Asked Questions
      </h3>
      
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index

        return (
          <div key={index} className="bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden transition-colors hover:border-white/10">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
              <span className={`text-sm font-bold transition-colors ${isOpen ? "text-primary" : "text-white"}`}>
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-white/40" />
              </motion.div>
            </button>
            
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className={`overflow-hidden min-h-0 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}>
                <div className="p-5 pt-0 text-sm text-white/60 leading-relaxed border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
