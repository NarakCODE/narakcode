"use client";

import { Bug, Code, Cpu, Rocket, UploadCloud } from "lucide-react";
import * as React from "react";

import { PinList } from "@/registry/pin-list";

const ITEMS = [
  {
    id: 1,
    name: "Code Your Dreams",
    info: "Every keystroke counts · Never stop building",
    icon: Rocket,
    pinned: true,
  },
  {
    id: 2,
    name: "Debug Your Limits",
    info: "Break barriers · You got this!",
    icon: Bug,
    pinned: true,
  },
  {
    id: 3,
    name: "Ship It Studio",
    info: "Turn ideas into reality · Closes 8:00 PM",
    icon: UploadCloud,
    pinned: false,
  },
  {
    id: 4,
    name: "Focus Mode",
    info: "Deep work zone · Flow state all day",
    icon: Cpu,
    pinned: false,
  },
  {
    id: 5,
    name: "Syntax Sanctuary",
    info: "Find beauty in code · Until 9:00 PM",
    icon: Code,
    pinned: false,
  },
];

export default function PinListDemo() {
  return <PinList items={ITEMS} />;
}
