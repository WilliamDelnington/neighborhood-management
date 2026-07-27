import React, { useEffect, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { EmptyState, ErrorState, LoadingState } from "@components/admin";
import { RequireAuth } from "@components/role";
import {
    fetchMyNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "@service/notificationApi";
import { formatDateTime } from "@utils/date-time";
import { AppNotification } from "@dts";
import { useStore } from "@store";

/**
 * Cac loai doi tuong lien quan co the dieu huong den man hinh chi tiet tuong ung
 * khi nguoi dung bam vao mot thong bao (giu dong bo voi ten model o backend).
 */
const RELATED_MODEL_PATH: Record<string, string> = {
    Complaint: "/complaints",
    Announcement: "/announcements",
    Meeting: "/meetings",
    Survey: "/surveys",
    HouseRecord: "/admin/houses",
};

const NotificationsPage: React.FC = () => (
    <RequireAuth>
        <NotificationsPageContent />
    </RequireAuth>
);

const NotificationsPageContent: React.FC = () => {
    const navigate = useNavigate();
    const refreshNotificationStatus = useStore(
        state => state.refreshNotificationStatus,
    );
    const markNotificationsSeen = useStore(
        state => state.markNotificationsSeen,
    );
    const [items, setItems] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchMyNotifications()
            .then(res => setItems(res.items))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    useEffect(() => {
        markNotificationsSeen();
    }, [markNotificationsSeen]);

    const handleOpen = (item: AppNotification) => {
        if (!item.readAt) {
            markNotificationRead(item.deliveryId)
                .then(() => refreshNotificationStatus())
                .catch(() => undefined);
            setItems(prev =>
                prev.map(n =>
                    n.deliveryId === item.deliveryId
                        ? { ...n, readAt: new Date().toISOString() }
                        : n,
                ),
            );
        }
        const { relatedModel, relatedId } = item.notification;
        const basePath = relatedModel
            ? RELATED_MODEL_PATH[relatedModel]
            : undefined;
        if (basePath && relatedId) {
            navigate(`${basePath}/${relatedId}`, { animate: true });
        }
    };

    const handleMarkAllRead = async () => {
        setMarkingAll(true);
        try {
            await markAllNotificationsRead();
            setItems(prev =>
                prev.map(n => ({
                    ...n,
                    readAt: n.readAt || new Date().toISOString(),
                })),
            );
            refreshNotificationStatus();
        } catch {
            // Bo qua loi mang - nguoi dung co the bam lai
        } finally {
            setMarkingAll(false);
        }
    };

    const hasUnread = items.some(item => !item.readAt);

    return (
        <PageLayout id="notifications-page" title="Thông báo của tôi">
            <Box className="bg-white mt-2">
                {hasUnread && (
                    <Box flex justifyContent="flex-end" p={3}>
                        <Text
                            size="xSmall"
                            className="text-main"
                            onClick={markingAll ? undefined : handleMarkAllRead}
                        >
                            {markingAll
                                ? "Đang xử lý..."
                                : "Đánh dấu tất cả đã đọc"}
                        </Text>
                    </Box>
                )}
                {loading && <LoadingState />}
                {!loading && error && <ErrorState onRetry={load} />}
                {!loading && !error && items.length === 0 && (
                    <EmptyState label="Bạn chưa có thông báo nào" />
                )}
                {!loading && !error && (
                    <Box px={4}>
                        {items.map(item => (
                            <Box
                                key={item.deliveryId}
                                py={3}
                                flex
                                alignItems="flex-start"
                                style={{ gap: 8 }}
                                className="border-b border-divider_01 last:border-0"
                                onClick={() => handleOpen(item)}
                            >
                                <Box
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        marginTop: 6,
                                        flexShrink: 0,
                                    }}
                                    className={item.readAt ? "" : "bg-main"}
                                />
                                <Box style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        size="small"
                                        className={
                                            item.readAt
                                                ? "font-normal"
                                                : "font-medium"
                                        }
                                    >
                                        {item.notification.title}
                                    </Text>
                                    <Text
                                        size="xxSmall"
                                        className="text-text_2 mt-1"
                                    >
                                        {item.notification.body}
                                    </Text>
                                    <Text
                                        size="xxSmall"
                                        className="text-text_3 mt-1"
                                    >
                                        {formatDateTime(
                                            new Date(
                                                item.sentAt ||
                                                    item.notification.createdAt,
                                            ),
                                        )}
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default NotificationsPage;
