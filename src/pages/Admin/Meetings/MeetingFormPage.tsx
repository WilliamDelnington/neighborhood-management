import React, { useEffect, useState } from "react";
import { Box, Text, useNavigate, useParams, useSnackbar } from "zmp-ui";
import { PageLayout } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatCard,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button, Input, TextArea, Checkbox } from "@components/customized";
import {
    createMeeting,
    updateMeeting,
    fetchMeetingDetail,
    fetchMeetingRegistrations,
    MeetingInput,
} from "@service/meetingApi";
import { DangKyHop } from "@dts";
import { DANG_KY_HOP_LABEL } from "@constants/domain";

type RegistrationItem = {
    _id: string;
    meetingId: string;
    userId: string | { _id: string; displayName?: string; phone?: string };
    answer: DangKyHop;
    delegateName?: string;
    createdAt: string;
};

/** Chuyen ISO string sang dinh dang gia tri cho input[type=datetime-local]. */
const toDateTimeLocalValue = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate(),
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const MeetingFormPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary", "neighborhood_leader"]}>
        <MeetingFormContent />
    </AdminGuard>
);

const MeetingFormContent: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { openSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(isEdit);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [location, setLocation] = useState("");
    const [content, setContent] = useState("");
    const [minutes, setMinutes] = useState("");
    const [published, setPublished] = useState(false);

    const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
    const [regLoading, setRegLoading] = useState(false);

    const loadDetail = () => {
        if (!id) return;
        setLoading(true);
        setLoadError(false);
        fetchMeetingDetail(id)
            .then(m => {
                setTitle(m.title);
                setStartTime(toDateTimeLocalValue(m.startTime));
                setLocation(m.location);
                setContent(m.content);
                setMinutes(m.minutes || "");
                setPublished(m.published);
            })
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
    };

    const loadRegistrations = () => {
        if (!id) return;
        setRegLoading(true);
        fetchMeetingRegistrations(id)
            .then(res =>
                setRegistrations(res.items as unknown as RegistrationItem[]),
            )
            .catch(() => setRegistrations([]))
            .finally(() => setRegLoading(false));
    };

    useEffect(() => {
        loadDetail();
        loadRegistrations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async () => {
        if (
            !title.trim() ||
            !startTime ||
            !location.trim() ||
            !content.trim()
        ) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập đầy đủ thông tin bắt buộc",
            });
            return;
        }
        const input: MeetingInput = {
            title: title.trim(),
            startTime: new Date(startTime).toISOString(),
            location: location.trim(),
            content: content.trim(),
            minutes: minutes.trim() || undefined,
            published,
        };
        try {
            setSaving(true);
            if (isEdit && id) {
                await updateMeeting(id, input);
                openSnackbar({ type: "success", text: "Đã cập nhật cuộc họp" });
            } else {
                await createMeeting(input);
                openSnackbar({ type: "success", text: "Đã tạo cuộc họp" });
            }
            navigate("/admin/meetings", { animate: true });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSaving(false);
        }
    };

    const countByAnswer = (answer: DangKyHop) =>
        registrations.filter(r => r.answer === answer).length;

    const registrantName = (r: RegistrationItem) => {
        if (typeof r.userId === "string") return r.delegateName || r.userId;
        return r.userId?.displayName || r.delegateName || "Người dùng";
    };

    return (
        <PageLayout
            id="admin-meeting-form"
            title={isEdit ? "Sửa cuộc họp" : "Thêm cuộc họp"}
        >
            <Box p={4}>
                {isEdit && loading && <LoadingState />}
                {isEdit && !loading && loadError && (
                    <ErrorState onRetry={loadDetail} />
                )}

                {(!isEdit || (!loading && !loadError)) && (
                    <Box className="bg-white rounded-2xl p-4 shadow-sm">
                        <Input
                            label="Tên cuộc họp"
                            placeholder="Nhập tên cuộc họp"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />

                        <Box mt={3}>
                            <Text
                                size="small"
                                className="font-medium text-text_1 mb-1"
                            >
                                Thời gian
                            </Text>
                            <input
                                type="datetime-local"
                                className="w-full bg-ng_10 rounded-xl px-3 py-2 text-sm border-none outline-none"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                            />
                        </Box>

                        <Box mt={3}>
                            <Input
                                label="Địa điểm"
                                placeholder="Nhập địa điểm tổ chức"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </Box>

                        <Box mt={3}>
                            <TextArea
                                label="Nội dung"
                                placeholder="Nội dung cuộc họp"
                                rows={4}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                        </Box>

                        <Box mt={3}>
                            <TextArea
                                label="Biên bản (nếu có)"
                                placeholder="Biên bản cuộc họp"
                                rows={3}
                                value={minutes}
                                onChange={e => setMinutes(e.target.value)}
                            />
                        </Box>

                        <Box mt={3}>
                            <Checkbox
                                label="Đăng công khai lên web app cho người dân"
                                value="published"
                                checked={published}
                                onChange={(checked: boolean) =>
                                    setPublished(checked)
                                }
                            />
                        </Box>

                        <Box mt={4}>
                            <Button
                                fullWidth
                                loading={saving}
                                onClick={handleSubmit}
                            >
                                {isEdit ? "Lưu thay đổi" : "Tạo cuộc họp"}
                            </Button>
                        </Box>
                    </Box>
                )}

                {isEdit && (
                    <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                        <Text.Title size="small" className="mb-2">
                            Tình hình đăng ký tham dự
                        </Text.Title>

                        {regLoading && <LoadingState />}

                        {!regLoading && (
                            <>
                                <Box flex flexWrap style={{ gap: 8 }} mb={3}>
                                    <StatCard
                                        label={DANG_KY_HOP_LABEL.co}
                                        value={countByAnswer("co")}
                                        tone="success"
                                    />
                                    <StatCard
                                        label={DANG_KY_HOP_LABEL.khong}
                                        value={countByAnswer("khong")}
                                        tone="danger"
                                    />
                                    <StatCard
                                        label={DANG_KY_HOP_LABEL.uy_quyen}
                                        value={countByAnswer("uy_quyen")}
                                        tone="warning"
                                    />
                                </Box>

                                {registrations.length === 0 ? (
                                    <EmptyState label="Chưa có ai đăng ký tham dự" />
                                ) : (
                                    registrations.map(r => (
                                        <ListRow
                                            key={r._id}
                                            title={registrantName(r)}
                                            subtitle={
                                                DANG_KY_HOP_LABEL[r.answer]
                                            }
                                        />
                                    ))
                                )}
                            </>
                        )}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default MeetingFormPage;
