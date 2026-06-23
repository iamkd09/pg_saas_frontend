"use client";

import { motion } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";

import { FloatingOrbs } from "@/components/auth/floating-orbs";

export function MobileBrandBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-[#0f172a] px-5 py-6 ring-1 ring-white/10 lg:hidden"
    >
      <FloatingOrbs variant="dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(56,189,248,0.2),_transparent_60%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm"
            >
              <Building2 className="size-5 text-sky-300" />
            </motion.div>
            <div>
              <p className="font-semibold tracking-tight text-white">PG Manager</p>
              <p className="text-xs text-slate-400">Property management SaaS</p>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="max-w-[220px] text-sm leading-relaxed text-slate-300"
          >
            Manage tenants, rent & properties — all in one elegant workspace.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: -12 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky-400/10 ring-1 ring-sky-400/25"
        >
          <Sparkles className="size-5 text-sky-300" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {["Tenants", "Rent", "Rooms", "Reports"].map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 + i * 0.06 }}
            className="shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10 backdrop-blur-sm"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
