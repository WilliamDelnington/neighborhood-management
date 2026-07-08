import React from "react";
import { Box, Text } from "zmp-ui";

export interface StatCardProps {
    label: string;
    value: string | number;
    tone?: "default" | "warning" | "danger" | "success";
    onClick?: () => void;
}

const TONE_CLASS: Record<NonNullable<StatCardProps["tone"]>, string> = {
    default: "text-main",
    warning: "text-amber-500",
    danger: "text-red-500",
    success: "text-green-600",
};

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    tone = "default",
    onClick,
}) => (
    <Box
        className="bg-white rounded-2xl p-3 shadow-sm"
        style={{ width: "calc(50% - 6px)" }}
        onClick={onClick}
    >
        <Text size="xxSmall" className="text-text_2">
            {label}
        </Text>
        <Text.Title size="large" className={`mt-1 ${TONE_CLASS[tone]}`}>
            {value}
        </Text.Title>
    </Box>
);

export default StatCard;
