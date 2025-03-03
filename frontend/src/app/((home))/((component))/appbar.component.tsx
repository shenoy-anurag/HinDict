"use client";

import React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";

import SvgIcon from "@/component/icons/svg-icon";
import { useTheme } from "@/app/hook/use-theme.hook";
import InfoModal from "./info-modal.component";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

/**
 * Appbar component
 */
export default function Appbar({ pressHome }: { pressHome: () => void }) {
  const { toggleTheme, darkMode } = useTheme();
  const [isInfoOpen, setInfoOpen] = React.useState(false);
  const handleModal = () => {
    setInfoOpen(!isInfoOpen)
  }

  return (
    <div className={`${inter.className}`}>
      <nav className="flex place-content-between py-6 theme-text-h3 ">
        <Link href={"/"} onClick={pressHome} title="HinDict">
          <SvgIcon className="h-6 w-6 " icon={"Book"} />
        </Link>

        <div className="flex place-content-center gap-3 ">
          <button onClick={handleModal}>
            <div className="flex items-center">
              <SvgIcon className="h-6 w-6 " icon={"Info"} />
            </div>
          </button>
          <a
            className="flex place-content-center"
            href="https://github.com/shenoy-anurag/HinDict"
          >
            <div className="flex items-center">
              <SvgIcon className="h-6 w-6 " icon={"Github"} />
            </div>
          </a>
          <a
            className="flex place-content-center"
            href="https://buymeacoffee.com/anuragshenoy"
          >
            <div className="flex items-center">
              <SvgIcon className="h-5 w-5 " icon={"BuyMeACoffee"} />
            </div>
          </a>
          <span className="px-2"></span>
          <button
            className="flex place-content-center"
            onClick={() => {
              toggleTheme();
            }}
          >
            <div className="flex items-center">
              <SvgIcon
                className="h-6 w-6 "
                variant={!darkMode ? "dark" : "light"}
                icon={"LightDark"}
              />
            </div>
          </button>

        </div>
      </nav>
      <InfoModal isOpen={isInfoOpen} onOpenChange={handleModal} />
    </div>
  );
}
