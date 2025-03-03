import React from "react";
import cx from "classnames";
import { SvgIconProps } from "./svg-icon";

export default function BuyMeACoffeeIcon({ className, size }: SvgIconProps<void>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cx("", className)}
            height={size ? size * 4 : "100%"}
            width={size ? size * 4 : "100%"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={"75%"}
        >
            <title>Buy Me A Coffee</title>
            <path
                d="M6.898 0L5.682 2.799H3.877v2.523h.695L5.277 9.8H4.172l1.46 8.23.938-.01L7.512 24h8.918l.062-.4.88-5.58.888.01 1.46-8.231h-1.056l.705-4.477h.756V2.8h-1.918L16.99 0H6.898zm.528.805h9.043l.771 1.78H6.652l.774-1.78zm-2.75 2.797H19.32v.92H4.676v-.92zm.453 6.998h13.635l-1.176 6.62-5.649-.06-5.636.06-1.174-6.62z"
            />
        </svg>
    );
}
