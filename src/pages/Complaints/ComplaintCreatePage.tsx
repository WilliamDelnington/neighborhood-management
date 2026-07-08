import React, { useState } from "react";
import { Box, Icon, Select, Text, useNavigate, useSnackbar } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { Button, Input, TextArea } from "@components/customized";
import { RequireAuth } from "@components/role";
import { createComplaint } from "@service/complaintApi";
import { NHOM_PHAN_ANH_LABEL } from "@constants/domain";
import { Complaint, NhomPhanAnh } from "@dts";

const ComplaintCreatePage: React.FC = () => (
    <RequireAuth>
        <ComplaintCreatePageContent />
    </RequireAuth>
);

const ComplaintCreatePageContent: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [category, setCategory] = useState<NhomPhanAnh | undefined>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [area, setArea] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [created, setCreated] = useState<Complaint | null>(null);

    const handleSubmit = async () => {
        if (!category) {
            openSnackbar({
                type: "error",
                text: "Vui lòng chọn nhóm phản ánh",
            });
            return;
        }
        if (!title.trim()) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập tiêu đề phản ánh",
            });
            return;
        }
        if (!content.trim()) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập nội dung phản ánh",
            });
            return;
        }

        try {
            setSubmitting(true);
            const complaint = await createComplaint({
                category,
                title: title.trim(),
                content: content.trim(),
                area: area.trim() || undefined,
                images: [],
            });
            setCreated(complaint);
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (created) {
        return (
            <PageLayout id="complaint-create-success" title="Gửi phản ánh">
                <Box
                    flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={6}
                    style={{ minHeight: "75vh" }}
                >
                    <Icon
                        icon="zi-check-circle-solid"
                        className="text-main"
                        size={56}
                    />
                    <Text.Title size="normal" className="mt-4 text-center">
                        Gửi phản ánh thành công
                    </Text.Title>
                    <Text
                        size="xSmall"
                        className="text-text_2 mt-2 text-center"
                    >
                        Mã phản ánh của bạn
                    </Text>
                    <Text.Title size="large" className="text-main mt-1">
                        {created.code}
                    </Text.Title>
                    <Text
                        size="xSmall"
                        className="text-text_2 mt-3 text-center"
                    >
                        Vui lòng lưu lại mã này để tra cứu tiến độ xử lý.
                    </Text>

                    <Box mt={8} style={{ width: "100%" }}>
                        <Button
                            fullWidth
                            onClick={() =>
                                navigate(`/complaints/${created._id}`, {
                                    animate: true,
                                })
                            }
                        >
                            Xem chi tiết
                        </Button>
                        <Box mt={3}>
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => navigate("/", { animate: true })}
                            >
                                Về trang chủ
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout id="complaint-create-page" title="Gửi phản ánh">
            <Box p={4}>
                <Text size="xSmall" className="font-medium text-text_1 mb-2">
                    Nhóm phản ánh
                </Text>
                <Select
                    placeholder="Chọn nhóm phản ánh"
                    value={category}
                    onChange={value => setCategory(value as NhomPhanAnh)}
                    closeOnSelect
                >
                    {Object.entries(NHOM_PHAN_ANH_LABEL).map(
                        ([value, label]) => (
                            <Select.Option
                                key={value}
                                value={value}
                                title={label}
                            />
                        ),
                    )}
                </Select>

                <Box mt={3}>
                    <Input
                        label="Tiêu đề"
                        placeholder="VD: Đèn đường ngõ 12 bị hỏng"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Box>

                <Box mt={3}>
                    <TextArea
                        label="Nội dung"
                        placeholder="Mô tả chi tiết sự việc..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={4}
                    />
                </Box>

                <Box mt={3}>
                    <Input
                        label="Địa chỉ/khu vực (không bắt buộc)"
                        placeholder="VD: Ngõ 12, cụm 3"
                        value={area}
                        onChange={e => setArea(e.target.value)}
                    />
                </Box>

                <Box mt={6}>
                    <Button
                        fullWidth
                        loading={submitting}
                        onClick={handleSubmit}
                    >
                        Gửi phản ánh
                    </Button>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default ComplaintCreatePage;
