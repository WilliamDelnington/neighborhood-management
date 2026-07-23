import { StateCreator } from "zustand";
import {
    fetchMyNotifications,
    fetchUnreadNotificationCount,
    markAllNotificationsRead,
    markMeetingNotificationsRead,
} from "@service/notificationApi";

export interface NotificationSlice {
    unreadCount: number;
    hasUnreadMeetingNotification: boolean;
    refreshNotificationStatus: () => Promise<void>;
    /**
     * Goi khi nguoi dung da xem muc Lich hop (danh sach hoac chi tiet) - danh dau
     * cac thong bao lien quan den cuoc hop la da doc roi lam moi lai trang thai,
     * de cham do tren trang chu bien mat ngay khi quay lai.
     */
    markMeetingsSeen: () => Promise<void>;
    /**
     * Goi khi nguoi dung da xem trang "Thong bao cua toi" - danh dau tat ca thong
     * bao la da doc roi lam moi lai trang thai, de cham do tren chuong/trang chu
     * bien mat ngay khi quay lai, khong can bam "Danh dau tat ca da doc".
     */
    markNotificationsSeen: () => Promise<void>;
}

const UNREAD_SCAN_LIMIT = 50;

const notificationSlice: StateCreator<
    NotificationSlice,
    [],
    [],
    NotificationSlice
> = (set, get) => ({
    unreadCount: 0,
    hasUnreadMeetingNotification: false,
    refreshNotificationStatus: async () => {
        try {
            const [{ count }, unread] = await Promise.all([
                fetchUnreadNotificationCount(),
                fetchMyNotifications(1, UNREAD_SCAN_LIMIT, true),
            ]);
            set(state => ({
                ...state,
                unreadCount: count,
                hasUnreadMeetingNotification: unread.items.some(
                    item => item.notification.relatedModel === "Meeting",
                ),
            }));
        } catch {
            set(state => ({
                ...state,
                unreadCount: 0,
                hasUnreadMeetingNotification: false,
            }));
        }
    },
    markMeetingsSeen: async () => {
        try {
            await markMeetingNotificationsRead();
        } catch {
            // Bo qua loi mang - lan sau refresh se thu lai
        }
        await get().refreshNotificationStatus();
    },
    markNotificationsSeen: async () => {
        try {
            await markAllNotificationsRead();
        } catch {
            // Bo qua loi mang - lan sau refresh se thu lai
        }
        await get().refreshNotificationStatus();
    },
});

export default notificationSlice;
