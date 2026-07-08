import React, { useEffect, useState } from "react";
import { Box, Icon, Text, useNavigate, useSnackbar } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatusBadge,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button } from "@components/customized";
import {
    fetchAdminAnnouncements,
    publishAnnouncement,
} from "@service/announcementApi";
import { Announcement } from "@dts";
import { LOAI_THONG_BAO_LABEL } from "@constants/domain";
import { DEFAULT_PAGE_SIZE } from "@constants/common";

/**
 * Trang thai thong bao khong nam trong @constants/domain nen dinh nghia rieng tai day.
 */
const ANNOUNCEMENT_STATUS_LABEL: Record<Announcement["status"], string> = {
    nhap: "Nháp",
    da_dang: "Đã đăng",
};

const STATUS_FILTERS: { key: "" | Announcement["status"]; label: string }[] = [
    { key: "", label: "Tất cả" },
    { key: "nhap", label: "Nháp" },
    { key: "da_dang", label: "Đã đăng" },
];

const AnnouncementAdminListPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary", "neighborhood_leader"]}>
        <PageLayout
            id="admin-announcements"
            title="Quản lý thông báo"
            bottomNav={<AppBottomNav />}
        >
            <AnnouncementAdminListContent />
        </PageLayout>
    </AdminGuard>
);

const AnnouncementAdminListContent: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [status, setStatus] = useState<"" | Announcement["status"]>("");
    const [items, setItems] = useState<Announcement[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [publishingId, setPublishingId] = useState<string | null>(null);

    const load = (targetPage: number, append: boolean) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(false);
        fetchAdminAnnouncements(
            targetPage,
            DEFAULT_PAGE_SIZE,
            status || undefined,
        )
            .then(res => {
                setItems(prev =>
                    append ? [...prev, ...res.items] : res.items,
                );
                setPage(res.page);
                setTotal(res.total);
                setTotalPages(res.totalPages);
            })
            .catch(() => setError(true))
            .finally(() => {
                setLoading(false);
                setLoadingMore(false);
            });
    };

    useEffect(() => {
        load(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const handlePublish = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            setPublishingId(id);
            await publishAnnouncement(id);
            openSnackbar({ type: "success", text: "Đã đăng thông báo" });
            load(1, false);
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setPublishingId(null);
        }
    };

    return (
        <Box p={4}>
            <Box flex alignItems="center" justifyContent="space-between" mb={3}>
                <Text.Title size="small">
                    Thông báo {total > 0 ? `(${total})` : ""}
                </Text.Title>
                <Button
                    size="small"
                    prefixIcon={<Icon icon="zi-plus" />}
                    onClick={() =>
                        navigate("/admin/announcements/create", {
                            animate: true,
                        })
                    }
                >
                    Thêm mới
                </Button>
            </Box>

            <Box flex style={{ gap: 8, overflowX: "auto" }} mb={3}>
                {STATUS_FILTERS.map(f => (
                    <Button
                        key={f.key || "all"}
                        size="small"
                        variant={status === f.key ? "primary" : "secondary"}
                        onClick={() => setStatus(f.key)}
                    >
                        {f.label}
                    </Button>
                ))}
            </Box>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState onRetry={() => load(1, false)} />}
            {!loading && !error && items.length === 0 && (
                <EmptyState label="Chưa có thông báo nào" />
            )}

            {!loading && !error && items.length > 0 && (
                <>
                    <Box className="bg-white rounded-2xl px-4 shadow-sm">
                        {items.map(a => (
                            <ListRow
                                key={a._id}
                                title={`${a.pinned ? "📌 " : ""}${a.title}`}
                                subtitle={LOAI_THONG_BAO_LABEL[a.category]}
                                right={
                                    <Box
                                        flex
                                        alignItems="center"
                                        style={{ gap: 8 }}
                                    >
                                        {a.status === "nhap" && (
                                            <Button
                                                size="small"
                                                variant="secondary"
                                                loading={publishingId === a._id}
                                                onClick={e =>
                                                    handlePublish(e, a._id)
                                                }
                                            >
                                                Đăng
                                            </Button>
                                        )}
                                        <StatusBadge
                                            label={
                                                ANNOUNCEMENT_STATUS_LABEL[
                                                    a.status
                                                ]
                                            }
                                            tone={
                                                a.status === "da_dang"
                                                    ? "green"
                                                    : "gray"
                                            }
                                        />
                                    </Box>
                                }
                                onClick={() =>
                                    navigate(
                                        `/admin/announcements/${a._id}/edit`,
                                        { animate: true },
                                    )
                                }
                            />
                        ))}
                    </Box>

                    {page < totalPages && (
                        <Box mt={3}>
                            <Button
                                fullWidth
                                variant="secondary"
                                loading={loadingMore}
                                onClick={() => load(page + 1, true)}
                            >
                                Tải thêm
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default AnnouncementAdminListPage;
