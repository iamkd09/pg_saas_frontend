"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { FloatingOrbs } from "@/components/auth/floating-orbs";

const features = [
  {
    icon: Building2,
    title: "Property overview",
    description: "Manage rooms, occupancy, and availability in one place.",
    color: "text-sky-300",
    bg: "bg-sky-400/15",
  },
  {
    icon: Users,
    title: "Tenant management",
    description: "Track tenants, leases, and move-in details effortlessly.",
    color: "text-indigo-300",
    bg: "bg-indigo-400/15",
  },
  {
    icon: CircleDollarSign,
    title: "Rent collection",
    description: "Monitor payments, dues, and monthly rent cycles.",
    color: "text-emerald-300",
    bg: "bg-emerald-400/15",
  },
  {
    icon: ShieldCheck,
    title: "Secure access",
    description: "Role-based control for owners, managers, and staff.",
    color: "text-violet-300",
    bg: "bg-violet-400/15",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0a0f1e] lg:flex lg:w-[52%] xl:w-[55%]">
      <FloatingOrbs variant="dark" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.22),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.25),_transparent_50%)]" />
      <div className="animate-gradient-shift absolute inset-0 opacity-30" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
            <div className="absolute inset-0 animate-pulse-glow rounded-2xl bg-sky-400/20" />
            <Building2 className="relative size-6 text-sky-300" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              PG Manager
            </p>
            <p className="text-sm text-slate-400">SaaS for PG owners</p>
          </div>
        </motion.div>

        <div className="max-w-lg space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3 py-1.5 text-xs font-medium tracking-wide text-sky-300 ring-1 ring-sky-400/20"
            >
              <Sparkles className="size-3.5" />
              Smart property management
            </motion.p>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-[2.75rem]">
              Run your PG business with{" "}
              <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                clarity & control
              </span>
            </h1>
            <p className="text-base leading-relaxed text-slate-300">
              A modern workspace to manage properties, tenants, rent, and
              complaints — built for owners who want less chaos and more growth.
            </p>
          </motion.div>

          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-3 sm:grid-cols-2"
          >
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <motion.li
                key={title}
                variants={item}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="group cursor-default rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div
                  className={`mb-3 flex size-9 items-center justify-center rounded-xl ${bg} ${color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="size-4.5" />
                </div>
                <p className="font-medium text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {["SK", "AR", "PM"].map((initials, i) => (
              <div
                key={initials}
                className="flex size-8 items-center justify-center rounded-full border-2 border-[#0a0f1e] bg-gradient-to-br from-sky-400/80 to-indigo-500/80 text-[10px] font-semibold text-white"
                style={{ zIndex: 3 - i }}
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            Trusted by{" "}
            <span className="font-medium text-slate-300">500+ PG owners</span>{" "}
            across India
          </p>
        </motion.div>
      </div>
    </div>
  );
}
