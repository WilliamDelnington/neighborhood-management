import React from "react";

const VoteIcon: React.FC<{ color?: string }> = ({ color }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 44 44"
    >
        <path
            fill={color || "#4F46E5"}
            d="M6 18h32v20a2 2 0 01-2 2H8a2 2 0 01-2-2V18z"
        />
        <path
            fill={color || "#4F46E5"}
            d="M4 14a2 2 0 012-2h32a2 2 0 012 2v4H4v-4z"
        />
        <path
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 24l4 4 8-8"
        />
    </svg>
);

export default VoteIcon;
