import * as Icon from "@components/icons";
import { Utinity } from "@dts";

export const APP_UTINITIES: Array<Utinity> = [
    {
        key: "create-complaint",
        label: "Gửi phản ánh",
        icon: Icon.PenIcon,
        color: "#2563EB",
        bgColor: "#EBF4FF",
        path: "/complaints/create",
        requiredPermission: "complaints.create",
    },
    {
        key: "lookup-complaint",
        label: "Tra cứu phản ánh",
        icon: Icon.SearchIcon,
        color: "#7C3AED",
        bgColor: "#F3E8FF",
        path: "/complaints/lookup",
    },
    {
        key: "announcements",
        label: "Xem thông báo",
        icon: Icon.NotificationIcon,
        color: "#D97706",
        bgColor: "#FEF3C7",
        path: "/announcements",
    },
    {
        key: "meetings",
        label: "Lịch họp",
        icon: Icon.CalendarIcon,
        color: "#16A34A",
        bgColor: "#DCFCE7",
        path: "/meetings",
    },
    {
        key: "surveys",
        label: "Khảo sát",
        icon: Icon.QAndAIcon,
        color: "#4F46E5",
        bgColor: "#E0E7FF",
        path: "/surveys",
    },
    {
        key: "files",
        label: "Biểu mẫu",
        icon: Icon.BookIcon,
        color: "#64748B",
        bgColor: "#F1F5F9",
        path: "/files",
    },
];

export const EMERGENCY_HOTLINES: Array<{
    key: string;
    label: string;
    phoneNumber: string;
}> = [
    { key: "police", label: "Công an", phoneNumber: "113" },
    { key: "fire", label: "Cứu hỏa", phoneNumber: "114" },
    { key: "ambulance", label: "Cấp cứu", phoneNumber: "115" },
];

export const CONTACTS: Array<Utinity> = [
    {
        key: "police-113",
        label: "Công an (113)",
        icon: Icon.HeadphoneIcon,
        phoneNumber: "113",
    },
    {
        key: "fire-114",
        label: "Phòng cháy chữa cháy (114)",
        icon: Icon.HeadphoneIcon,
        phoneNumber: "114",
    },
    {
        key: "ambulance-115",
        label: "Cấp cứu y tế (115)",
        icon: Icon.HeadphoneIcon,
        phoneNumber: "115",
    },
    {
        key: "regional-police",
        label: "Công an khu vực phường Dương Nội",
        icon: Icon.PersonalIcon,
        phoneNumber: "",
    },
    {
        key: "neighborhood-leader",
        label: "Tổ trưởng Tổ dân phố Hòa Bình",
        icon: Icon.EnterpriseIcon,
        phoneNumber: "",
    },
];
