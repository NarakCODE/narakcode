import {
  JetBrains_Mono as FontMono,
  Roboto as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  display: "swap",
  subsets: ["latin"],
  variable: "--d-font-sans",
});

export const fontMono = FontMono({
  display: "swap",
  subsets: ["latin"],
  variable: "--d-font-mono",
});
