import React from "react";

const HouseIcon: React.FC<{ color?: string }> = ({ color }) => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2.667L2.667 13.333V29.333h9.334v-9.333h8v9.333h9.332V13.333L16 2.667zm-2.667 20V17.333h5.334v5.334h-5.334z"
            fill={color || "url(#paint0_linear_house)"}
        />
        <defs>
            <linearGradient
                id="paint0_linear_house"
                x1="16"
                y1="29.333"
                x2="16"
                y2="2.667"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#0E6AC8" />
                <stop offset="1" stopColor="#8ABEFF" />
            </linearGradient>
        </defs>
    </svg>
);

export default HouseIcon;
