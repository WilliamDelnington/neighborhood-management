import React, { useEffect, useState } from "react";
import { Box, Select, useNavigate, useParams, useSnackbar } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { AdminGuard, LoadingState, ErrorState } from "@components/admin";
import { Button, Input, TextArea, Checkbox } from "@components/customized";
import {
    createAnnouncement,
    updateAnnouncement,
    publishAnnouncement,
    fetchAnnouncementDetail,
    AnnouncementInput,
} from "@service/announcementApi";
import { LoaiThongBao } from "@dts";
import { LOAI_THONG_BAO_LABEL } from "@constants/domain";

const AnnouncementFormPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary", "neighborhood_leader"]}>
        <AnnouncementFormContent />
    </AdminGuard>
);

const AnnouncementFormContent: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { openSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(isEdit);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<LoaiThongBao>("chung");
    const [priority, setPriority] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [audienceAll, setAudienceAll] = useState(true);
    const [status, setStatus] = useState<"nhap" | "da_dang">("nhap");

    const loadDetail = () => {
        if (!id) return;
        setLoading(true);
        setLoadError(false);
        fetchAnnouncementDetail(id)
            .then(a => {
                setTitle(a.title);
                setContent(a.content);
                setCategory(a.category);
                setPriority(a.priority);
                setPinned(a.pinned);
                setStatus(a.status);
            })
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập tiêu đề và nội dung",
            });
            return;
        }
        const input: AnnouncementInput = {
            title: title.trim(),
            content: content.trim(),
            category,
            priority,
            pinned,
            audienceAll,
        };
        try {
            setSaving(true);
            if (isEdit && id) {
                await updateAnnouncement(id, input);
                openSnackbar({
                    type: "success",
                    text: "Đã cập nhật thông báo",
                });
            } else {
                await createAnnouncement(input);
                openSnackbar({
                    type: "success",
                    text: "Đã tạo thông báo (bản nháp)",
                });
            }
            navigate("/admin/announcements", { animate: true });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!id) return;
        try {
            setPublishing(true);
            await publishAnnouncement(id);
            openSnackbar({
                type: "success",
                text: "Đã đăng thông báo tới người dân",
            });
            navigate("/admin/announcements", { animate: true });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setPublishing(false);
        }
    };

    if (isEdit && loading)
        return (
            <PageLayout id="admin-announcement-form" title="Sửa thông báo">
                <LoadingState />
            </PageLayout>
        );
    if (isEdit && loadError) {
        return (
            <PageLayout id="admin-announcement-form" title="Sửa thông báo">
                <ErrorState onRetry={loadDetail} />
            </PageLayout>
        );
    }

    return (
        <PageLayout
            id="admin-announcement-form"
            title={isEdit ? "Sửa thông báo" : "Thêm thông báo"}
        >
            <Box p={4}>
                <Box className="bg-white rounded-2xl p-4 shadow-sm">
                    <Input
                        label="Tiêu đề"
                        placeholder="Nhập tiêu đề thông báo"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    <Box mt={3}>
                        <TextArea
                            label="Nội dung"
                            placeholder="Nội dung thông báo"
                            rows={5}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </Box>

                    <Box mt={3}>
                        <Select
                            label="Phân loại"
                            placeholder="Chọn phân loại"
                            value={category}
                            onChange={val => setCategory(val as LoaiThongBao)}
                        >
                            {(
                                Object.entries(LOAI_THONG_BAO_LABEL) as [
                                    LoaiThongBao,
                                    string,
                                ][]
                            ).map(([key, label]) => (
                                <Select.Option
                                    key={key}
                                    value={key}
                                    title={label}
                                />
                            ))}
                        </Select>
                    </Box>

                    <Box mt={3} flex flexDirection="column" style={{ gap: 8 }}>
                        <Checkbox
                            label="Thông báo ưu tiên"
                            value="priority"
                            checked={priority}
                            onChange={(checked: boolean) =>
                                setPriority(checked)
                            }
                        />
                        <Checkbox
                            label="Ghim lên đầu danh sách"
                            value="pinned"
                            checked={pinned}
                            onChange={(checked: boolean) => setPinned(checked)}
                        />
                        <Checkbox
                            label="Gửi tới toàn bộ người dân"
                            value="audienceAll"
                            checked={audienceAll}
                            onChange={(checked: boolean) =>
                                setAudienceAll(checked)
                            }
                        />
                    </Box>

                    <Box mt={4} flex flexDirection="column" style={{ gap: 8 }}>
                        <Button
                            fullWidth
                            loading={saving}
                            onClick={handleSubmit}
                        >
                            {isEdit ? "Lưu thay đổi" : "Lưu bản nháp"}
                        </Button>
                        {isEdit && status === "nhap" && (
                            <Button
                                fullWidth
                                variant="secondary"
                                loading={publishing}
                                onClick={handlePublish}
                            >
                                Đăng thông báo
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default AnnouncementFormPage;
