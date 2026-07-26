export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const MINI_APP_ID =
    window.APP_ID || (import.meta.env.VITE_MINI_APP_ID as string);

/**
 * URL cua trang quan tri web rieng (quan-ly-to-dan-pho-hoa-binh-admin) - mo trong
 * trinh duyet ngoai qua openWebView, khong con nam trong Mini App nay nua.
 */
export const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL as string;

export const API = {
    AUTH_ZALO_LOGIN: "/api/auth/zalo/login",
    AUTH_REGISTER: "/api/auth/register",
    AUTH_LOGIN: "/api/auth/login",
    AUTH_SET_PASSWORD: "/api/auth/set-password",
    AUTH_ME: "/api/auth/me",
    AUTH_LOGOUT: "/api/auth/logout",

    HOUSES: "/api/houses",
    HOUSEHOLDS: "/api/households",
    HOUSEHOLDS_LOOKUP: "/api/households/lookup",
    CITIZENS: "/api/citizens",
    NEIGHBORHOODS: "/api/neighborhoods",
    BUSINESSES: "/api/businesses",
    BUSINESS_TYPES: "/api/business-types",

    COMPLAINTS: "/api/complaints",
    COMPLAINTS_MINE: "/api/complaints/mine",
    COMPLAINTS_LOOKUP: "/api/complaints/lookup",

    SUPPORT_TICKETS: "/api/support-tickets",
    SUPPORT_TICKETS_MINE: "/api/support-tickets/mine",

    ANNOUNCEMENTS: "/api/announcements",
    MEETINGS: "/api/meetings",
    SURVEYS: "/api/surveys",

    NOTIFICATIONS: "/api/notifications",
    NOTIFICATIONS_UNREAD_COUNT: "/api/notifications/unread-count",
    NOTIFICATIONS_READ_ALL: "/api/notifications/read-all",

    FILES: "/api/files",
    SETTINGS: "/api/settings",
};

export const SEARCH_NOT_FOUND = "Không tìm thấy thông tin";

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_COMPLAINT_IMAGES = 4;
