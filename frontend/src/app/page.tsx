"use client";

import { Source_Serif_4 } from "next/font/google";
import HomePage from "./((home))/home.page";

const nunitoSans = Source_Serif_4({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <div className={nunitoSans.className}>
      <HomePage />
    </div>
  );
}
