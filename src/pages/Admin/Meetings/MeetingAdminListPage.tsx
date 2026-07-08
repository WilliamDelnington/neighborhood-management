import React, { useEffect, useState } from "react";
import { Box, Icon, Text, useNavigate } from "zmp-ui";
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
import { fetchMeetings } from "@service/meetingApi";
import { Meeting } from "@dts";

/**
 * Dinh dang ngay gio kieu Viet Nam, dung chung cho cac man hinh cuoc hop.
 */
const formatDateTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    });
};

const MeetingAdminListPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary", "neighborhood_leader"]}>
        <PageLayout
            id="admin-meetings"
            title="Quản lý cuộc họp"
            bottomNav={<AppBottomNav />}
        >
            <MeetingAdminListContent />
        </PageLayout>
    </AdminGuard>
);

const MeetingAdminListContent: React.FC = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchMeetings(false)
            .then(res => {
                setMeetings(res.items);
                setTotal(res.total);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    return (
        <Box p={4}>
            <Box flex alignItems="center" justifyContent="space-between" mb={3}>
                <Text.Title size="small">
                    Cuộc họp {total > 0 ? `(${total})` : ""}
                </Text.Title>
                <Button
                    size="small"
                    prefixIcon={<Icon icon="zi-plus" />}
                    onClick={() =>
                        navigate("/admin/meetings/create", { animate: true })
                    }
                >
                    Thêm mới
                </Button>
            </Box>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState onRetry={load} />}
            {!loading && !error && meetings.length === 0 && (
                <EmptyState label="Chưa có cuộc họp nào được tạo" />
            )}

            {!loading && !error && meetings.length > 0 && (
                <Box className="bg-white rounded-2xl px-4 shadow-sm">
                    {meetings.map(m => (
                        <ListRow
                            key={m._id}
                            title={m.title}
                            subtitle={`${formatDateTime(m.startTime)} · ${
                                m.location
                            }`}
                            right={
                                <StatusBadge
                                    label={m.published ? "Đã đăng" : "Nháp"}
                                    tone={m.published ? "green" : "gray"}
                                />
                            }
                            onClick={() =>
                                navigate(`/admin/meetings/${m._id}/edit`, {
                                    animate: true,
                                })
                            }
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default MeetingAdminListPage;
