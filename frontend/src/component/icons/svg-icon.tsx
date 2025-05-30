/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import cx from "classnames";
import BookIcon from "./book.icon";
import ToggleIcon from "./toggle.icon";
import SearchIcon from "./search.icon";
import LightDark from "./light-dark.icon";
import Play from "./play-pause.icon";
import GithubIcon from "./github.icon";
import BuyMeACoffeeIcon from "./buy-me-a-coffee.icon";
import InfoIcon from "./info.icon";
type Icons = "Book" | "Toggle" | "Search" | "LightDark" | "Play" | "Github" | "BuyMeACoffee" | "Info";

export type SvgIconSize =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;
export class Config<T> {
  public variant: Variant<T>;
  constructor(public value: T) {
    this.variant = value as Variant<T>;
  }
}
export type Variant<T> = T;

export type SvgIconProps<Config> = {
  className?: string;
  size?: SvgIconSize;
  config?: Config;
};

type SvgIconButtonProps = {
  icon: Icons;
  className?: string;
  onClick?: (e: any) => void;
  size?: SvgIconSize;
  variant?: any;
};

const SvgIcon = ({
  icon,
  className,
  size = 5,
  variant,
  onClick,
}: SvgIconButtonProps) => {
  return (
    <span onClick={onClick} style={{ display: "inline-block" }}>
      {getSVGIcon(icon, size, className, variant)}
    </span>
  );
};

export default SvgIcon;

function getSVGIcon(
  icon: Icons,
  size?: SvgIconSize,
  className: string = "",
  variant?: any
) {
  switch (icon) {
    case "Book":
      return <BookIcon size={size} className={className} />;
    case "Toggle":
      return (
        <ToggleIcon
          size={size}
          className={className}
          config={new Config<Variant<"on" | "off">>(variant)}
        />
      );
    case "Search":
      return <SearchIcon size={size} className={className} />;
    case "LightDark":
      return (
        <LightDark
          size={size}
          className={className}
          config={new Config<Variant<"light" | "dark">>(variant)}
        />
      );
    case "Play":
      return (
        <Play
          size={size}
          className={className}
          config={new Config<Variant<"play" | "pause">>(variant)}
        />
      );
    case "Github":
      return <GithubIcon size={size} className={className} />;
    case "BuyMeACoffee":
      return <BuyMeACoffeeIcon size={size} className={className} />;
    case "Info":
      return <InfoIcon size={size} className={className} />;

    default:
      return <></>;
  }
}
