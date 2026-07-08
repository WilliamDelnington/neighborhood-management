import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { AppNotification, PaginatedData } from "@dts";
import { request } from "./request";

export const fetchMyNotifications = (
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    unreadOnly = false,
): Promise<PaginatedData<AppNotification>> =>
    request<PaginatedData<AppNotification>>("GET", API.NOTIFICATIONS, {
        page,
        limit,
        unreadOnly: unreadOnly ? "true" : undefined,
    });

export const fetchUnreadNotificationCount = (): Promise<{ count: number }> =>
    request<{ count: number }>("GET", API.NOTIFICATIONS_UNREAD_COUNT);

export const markNotificationRead = (deliveryId: string): Promise<unknown> =>
    request("POST", `${API.NOTIFICATIONS}/${deliveryId}/read`);

export const markAllNotificationsRead = (): Promise<unknown> =>
    request("POST", API.NOTIFICATIONS_READ_ALL);
