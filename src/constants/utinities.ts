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

/**
 * Danh sach tien ich mo rong hien trong the "Tien ich khac" tren Home - khac
 * voi APP_UTINITIES (6 thao tac nhanh luon hien day du), danh sach nay co the
 * dai hon 6 va Home chi hien 6 muc dau tien, an cac muc con lai sau nut
 * "Xem them" (xem HomePage.tsx). Thu tu trong mang la thu tu uu tien hien thi
 * (bien tap thu cong, khong dua tren so lieu su dung thuc te).
 */
export const MORE_FEATURES: Array<Utinity> = [
    {
        key: "admin-houses",
        label: "Nhà số của tôi",
        icon: Icon.HouseIcon,
        color: "#0891B2",
        bgColor: "#CFFAFE",
        path: "/admin/houses",
        requiredPermission: "houses.read",
    },
    {
        key: "admin-households",
        label: "Hộ dân",
        icon: Icon.EnterpriseIcon,
        color: "#C2410C",
        bgColor: "#FFEDD5",
        path: "/admin/households",
        requiredPermission: "households.read",
    },
    {
        key: "admin-citizens",
        label: "Nhân khẩu",
        icon: Icon.PersonalIcon,
        color: "#0D9488",
        bgColor: "#CCFBF1",
        path: "/admin/citizens",
        requiredPermission: "citizens.read",
    },
    {
        key: "support",
        label: "Hỗ trợ",
        icon: Icon.HeadsetIcon,
        color: "#4338CA",
        bgColor: "#E0E7FF",
        path: "/support",
    },
    {
        key: "notifications",
        label: "Thông báo của tôi",
        icon: Icon.NotificationIcon,
        color: "#CA8A04",
        bgColor: "#FEF9C3",
        path: "/notifications",
    },
    {
        key: "admin-business-types",
        label: "Loại hình kinh doanh",
        icon: Icon.GlobeIcon,
        color: "#6D28D9",
        bgColor: "#EDE9FE",
        path: "/admin/business-types",
        requiredPermission: "business_types.read",
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
        label: "Tổ trưởng tổ dân phố",
        icon: Icon.EnterpriseIcon,
        phoneNumber: "",
    },
];
