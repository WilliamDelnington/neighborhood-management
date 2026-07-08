export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const MINI_APP_ID =
    window.APP_ID || (import.meta.env.VITE_MINI_APP_ID as string);

export const API = {
    AUTH_ZALO_LOGIN: "/api/auth/zalo/login",
    AUTH_ME: "/api/auth/me",
    AUTH_LOGOUT: "/api/auth/logout",

    USERS: "/api/users",
    ROLES: "/api/roles",

    HOUSEHOLDS: "/api/households",
    CITIZENS: "/api/citizens",

    COMPLAINTS: "/api/complaints",
    COMPLAINTS_MINE: "/api/complaints/mine",
    COMPLAINTS_LOOKUP: "/api/complaints/lookup",

    ANNOUNCEMENTS: "/api/announcements",
    MEETINGS: "/api/meetings",
    SURVEYS: "/api/surveys",

    PCCC: "/api/pccc",
    SECURITY: "/api/security",

    NOTIFICATIONS: "/api/notifications",
    NOTIFICATIONS_UNREAD_COUNT: "/api/notifications/unread-count",
    NOTIFICATIONS_READ_ALL: "/api/notifications/read-all",

    FINANCE: "/api/finance",
    FILES: "/api/files",
    SETTINGS: "/api/settings",

    REPORTS: "/api/reports",
    IMPORT: "/api/import",
    EXPORT: "/api/export",
};

export const SEARCH_NOT_FOUND = "Không tìm thấy thông tin";

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_COMPLAINT_IMAGES = 4;
