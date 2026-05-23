"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Coffee, Footprints, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function BustedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100 selection:bg-zinc-800">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        {/* Minimal Image Container */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-zinc-900 shadow-sm ring-1 ring-zinc-800">
          <Image
            src="/images/cat-tongue.gif"
            alt="Not today"
            width={280}
            height={280}
            className="h-64 w-64 object-cover transition-all duration-500 hover:grayscale-0"
            priority
            unoptimized
          />
        </div>

        {/* Typography */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Not today!
        </h1>

        <div className="mt-3 flex items-center justify-center gap-2 text-zinc-500">
          <ShieldAlert className="h-4 w-4" />
          <p className="text-sm font-medium tracking-widest uppercase">
            Access Restricted
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-12 bg-zinc-800" />

        {/* Minimal List */}
        <div className="w-full space-y-4">
          <p className="mb-4 text-xs font-medium tracking-wider text-zinc-600 uppercase">
            Go do something:
          </p>

          <Suggestion
            icon={Footprints}
            label="Take a walk"
            sub="Clear your mind"
          />
          <Suggestion
            icon={BookOpen}
            label="Read a book"
            sub="Learn something new"
          />
          <Suggestion icon={Coffee} label="Drink water" sub="Stay hydrated" />
        </div>

        {/* Footer */}
        <p className="mt-12 text-[10px] text-zinc-700">
          Security System · Narak CODE
        </p>
      </motion.div>
    </div>
  );
}

function Suggestion({
  icon: Icon,
  label,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
}) {
  return (
    <div className="group flex w-full items-center gap-4 rounded-lg bg-zinc-900/50 px-4 py-3 transition-colors hover:bg-zinc-900">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-zinc-500 ring-1 ring-zinc-800 transition-colors group-hover:text-zinc-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
          {label}
        </span>
        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500">
          {sub}
        </span>
      </div>
    </div>
  );
}
