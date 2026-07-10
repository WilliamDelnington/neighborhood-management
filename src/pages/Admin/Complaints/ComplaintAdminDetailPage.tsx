import React, { useEffect, useState } from "react";
import {
    Box,
    DatePicker,
    Select,
    Sheet,
    Text,
    useParams,
    useSnackbar,
} from "zmp-ui";
import { PageLayout } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatusBadge,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button, Checkbox, Input, TextArea } from "@components/customized";
import {
    NHOM_PHAN_ANH_LABEL,
    TRANG_THAI_PHAN_ANH_LABEL,
    TRANG_THAI_PHAN_ANH_TONE,
} from "@constants/domain";
import {
    AppError,
    Complaint,
    ComplaintTimelineEntry,
    TrangThaiPhanAnh,
} from "@dts";
import {
    assignComplaint,
    fetchComplaintDetail,
    updateComplaintStatus,
} from "@service/complaintApi";
import { AssignableStaff, fetchAssignableStaff } from "@service/userApi";

const VIEW_ROLES = [
    "admin",
    "neighborhood_leader",
    "regional_police",
    "people_committee_official",
] as const;

const formatDateTime = (value?: string) =>
    value ? new Date(value).toLocaleString("vi-VN") : "";
const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("vi-VN") : "";

const ComplaintAdminDetailPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <ComplaintAdminDetailContent />
    </AdminGuard>
);

const ComplaintAdminDetailContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [timeline, setTimeline] = useState<ComplaintTimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [newStatus, setNewStatus] = useState<TrangThaiPhanAnh | "">("");
    const [note, setNote] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [assigneeSheetVisible, setAssigneeSheetVisible] = useState(false);
    const [assigneeSearch, setAssigneeSearch] = useState("");
    const [assigneeStaff, setAssigneeStaff] = useState<AssignableStaff[]>([]);
    const [assigneeLoading, setAssigneeLoading] = useState(false);
    const [expectedCompletionDate, setExpectedCompletionDate] =
        useState<Date | null>(null);
    const [assigning, setAssigning] = useState(false);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setError(false);
        fetchComplaintDetail(id)
            .then(res => {
                setComplaint(res.complaint);
                setTimeline(res.timeline);
                setNewStatus(res.complaint.status);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!assigneeSheetVisible) return;
        setAssigneeLoading(true);
        fetchAssignableStaff()
            .then(setAssigneeStaff)
            .catch(() => setAssigneeStaff([]))
            .finally(() => setAssigneeLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assigneeSheetVisible]);

    const assigneeResults = assigneeStaff.filter(s =>
        s.displayName.toLowerCase().includes(assigneeSearch.toLowerCase()),
    );

    const handleUpdateStatus = async () => {
        if (!id || !newStatus) return;
        try {
            setUpdating(true);
            const updated = await updateComplaintStatus(id, {
                status: newStatus,
                note: note.trim() || undefined,
                isPublic,
            });
            setComplaint(updated);
            setNote("");
            openSnackbar({
                type: "success",
                text: "Đã cập nhật trạng thái phản ánh",
            });
            load();
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setUpdating(false);
        }
    };

    const handleAssign = async (user: AssignableStaff) => {
        if (!id) return;
        try {
            setAssigning(true);
            const updated = await assignComplaint(
                id,
                user.id,
                expectedCompletionDate
                    ? expectedCompletionDate.toISOString()
                    : undefined,
            );
            setComplaint(updated);
            setAssigneeSheetVisible(false);
            openSnackbar({
                type: "success",
                text: `Đã giao cho ${user.displayName}`,
            });
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setAssigning(false);
        }
    };

    const assigneeName =
        complaint &&
        typeof complaint.assigneeId === "object" &&
        complaint.assigneeId
            ? complaint.assigneeId.displayName
            : undefined;
    const creator =
        complaint && typeof complaint.createdByUserId === "object"
            ? complaint.createdByUserId
            : undefined;

    return (
        <PageLayout id="admin-complaint-detail" title="Chi tiết phản ánh">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && error && <ErrorState onRetry={load} />}

                {!loading && !error && complaint && (
                    <>
                        <Box className="bg-white rounded-2xl p-4 shadow-sm">
                            <Box
                                flex
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Text.Title size="small">
                                    {complaint.code}
                                </Text.Title>
                                <StatusBadge
                                    label={
                                        TRANG_THAI_PHAN_ANH_LABEL[
                                            complaint.status
                                        ]
                                    }
                                    tone={
                                        TRANG_THAI_PHAN_ANH_TONE[
                                            complaint.status
                                        ]
                                    }
                                />
                            </Box>
                            <Text size="small" className="font-medium mt-2">
                                {complaint.title}
                            </Text>
                            <Text size="xSmall" className="text-text_2 mt-1">
                                {NHOM_PHAN_ANH_LABEL[complaint.category]}
                                {complaint.area ? ` • ${complaint.area}` : ""}
                            </Text>
                            <Text size="xSmall" className="mt-3">
                                {complaint.content}
                            </Text>

                            {complaint.images.length > 0 && (
                                <Box flex flexWrap mt={3} style={{ gap: 8 }}>
                                    {complaint.images.map(img => (
                                        <img
                                            key={img}
                                            src={img}
                                            alt="Ảnh đính kèm"
                                            style={{
                                                width: 88,
                                                height: 88,
                                                borderRadius: 8,
                                                objectFit: "cover",
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}

                            <Box
                                mt={3}
                                className="border-t border-divider_01 pt-3"
                            >
                                {creator && (
                                    <InfoRow
                                        label="Người gửi"
                                        value={`${creator.displayName}${
                                            creator.phone
                                                ? ` (${creator.phone})`
                                                : ""
                                        }`}
                                    />
                                )}
                                <InfoRow
                                    label="Người phụ trách"
                                    value={assigneeName || "Chưa phân công"}
                                />
                                {complaint.expectedCompletionDate && (
                                    <InfoRow
                                        label="Dự kiến hoàn thành"
                                        value={formatDate(
                                            complaint.expectedCompletionDate,
                                        )}
                                    />
                                )}
                                {complaint.actualCompletionDate && (
                                    <InfoRow
                                        label="Ngày hoàn thành"
                                        value={formatDate(
                                            complaint.actualCompletionDate,
                                        )}
                                    />
                                )}
                                {complaint.internalNotes && (
                                    <InfoRow
                                        label="Ghi chú nội bộ"
                                        value={complaint.internalNotes}
                                    />
                                )}
                            </Box>
                        </Box>

                        <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                            <Text.Title size="small" className="mb-2">
                                Phân công xử lý
                            </Text.Title>
                            <DatePicker
                                label="Dự kiến hoàn thành (tùy chọn)"
                                title="Chọn ngày dự kiến hoàn thành"
                                value={expectedCompletionDate || undefined}
                                onChange={date =>
                                    setExpectedCompletionDate(date)
                                }
                                placeholder="Chọn ngày"
                            />
                            <Box mt={3}>
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() =>
                                        setAssigneeSheetVisible(true)
                                    }
                                >
                                    {assigneeName
                                        ? `Đang giao: ${assigneeName} — Đổi người`
                                        : "Chọn người phụ trách"}
                                </Button>
                            </Box>
                        </Box>

                        <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                            <Text.Title size="small" className="mb-2">
                                Cập nhật trạng thái
                            </Text.Title>
                            <Select
                                label="Trạng thái mới"
                                closeOnSelect
                                value={newStatus}
                                onChange={v =>
                                    setNewStatus(v as TrangThaiPhanAnh)
                                }
                            >
                                {(
                                    Object.entries(
                                        TRANG_THAI_PHAN_ANH_LABEL,
                                    ) as [TrangThaiPhanAnh, string][]
                                ).map(([key, label]) => (
                                    <Select.Option
                                        key={key}
                                        title={label}
                                        value={key}
                                    />
                                ))}
                            </Select>
                            <Box mt={3}>
                                <TextArea
                                    label="Ghi chú xử lý"
                                    placeholder="Nội dung cập nhật, phản hồi cho người dân..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </Box>
                            <Box mt={2}>
                                <Checkbox
                                    label="Ghi chú công khai cho người dân"
                                    value="isPublic"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(!isPublic)}
                                />
                            </Box>
                            <Box mt={3}>
                                <Button
                                    fullWidth
                                    loading={updating}
                                    onClick={handleUpdateStatus}
                                    disabled={!newStatus}
                                >
                                    Cập nhật trạng thái
                                </Button>
                            </Box>
                        </Box>

                        <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                            <Text.Title size="small" className="mb-2">
                                Lịch sử xử lý
                            </Text.Title>
                            {timeline.length === 0 && (
                                <EmptyState label="Chưa có lịch sử xử lý" />
                            )}
                            {timeline.map(t => (
                                <Box
                                    key={t._id}
                                    py={2}
                                    className="border-b border-divider_01 last:border-0"
                                >
                                    <Box
                                        flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <StatusBadge
                                            label={
                                                TRANG_THAI_PHAN_ANH_LABEL[
                                                    t.status
                                                ]
                                            }
                                            tone={
                                                TRANG_THAI_PHAN_ANH_TONE[
                                                    t.status
                                                ]
                                            }
                                        />
                                        <Text
                                            size="xxSmall"
                                            className="text-text_2"
                                        >
                                            {formatDateTime(t.createdAt)}
                                        </Text>
                                    </Box>
                                    {t.note && (
                                        <Text size="xSmall" className="mt-1">
                                            {t.note}
                                        </Text>
                                    )}
                                    {!t.isPublic && (
                                        <Text
                                            size="xxSmall"
                                            className="text-text_3 mt-1"
                                        >
                                            (Ghi chú nội bộ)
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Box>

            <Sheet
                visible={assigneeSheetVisible}
                onClose={() => setAssigneeSheetVisible(false)}
                title="Chọn người phụ trách"
                height="80vh"
                autoHeight={false}
            >
                <Box
                    p={4}
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Input
                        placeholder="Tìm theo tên cán bộ..."
                        value={assigneeSearch}
                        onChange={e => setAssigneeSearch(e.target.value)}
                    />
                    <Box style={{ flex: 1, overflowY: "auto", marginTop: 12 }}>
                        {assigneeLoading && <LoadingState />}
                        {!assigneeLoading && assigneeResults.length === 0 && (
                            <EmptyState label="Không tìm thấy cán bộ phù hợp" />
                        )}
                        {!assigneeLoading &&
                            assigneeResults.map(u => (
                                <ListRow
                                    key={u.id}
                                    title={u.displayName}
                                    onClick={() =>
                                        !assigning && handleAssign(u)
                                    }
                                />
                            ))}
                    </Box>
                </Box>
            </Sheet>
        </PageLayout>
    );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({
    label,
    value,
}) => (
    <Box flex justifyContent="space-between" py={1}>
        <Text size="xxSmall" className="text-text_2">
            {label}
        </Text>
        <Text size="xxSmall" className="text-right" style={{ maxWidth: "70%" }}>
            {value}
        </Text>
    </Box>
);

export default ComplaintAdminDetailPage;
