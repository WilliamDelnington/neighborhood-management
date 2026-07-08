import React, { useEffect, useState } from "react";
import {
    Box,
    Icon,
    Select,
    Text,
    useNavigate,
    useParams,
    useSnackbar,
} from "zmp-ui";
import { PageLayout } from "@components/layout";
import { AdminGuard, LoadingState, ErrorState } from "@components/admin";
import { Button, Input, TextArea, Checkbox } from "@components/customized";
import {
    createSurvey,
    updateSurvey,
    fetchSurveyDetail,
    SurveyInput,
} from "@service/surveyApi";
import { LoaiCauHoiKhaoSat, SurveyQuestion } from "@dts";
import { LOAI_CAU_HOI_KHAO_SAT_LABEL } from "@constants/domain";

type DraftQuestion = Omit<SurveyQuestion, "_id">;

const EMPTY_QUESTION: DraftQuestion = {
    question: "",
    type: "chon_mot",
    options: ["", ""],
    required: true,
};

const OPTIONS_TYPES: LoaiCauHoiKhaoSat[] = ["chon_mot", "chon_nhieu"];

const SurveyFormPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary"]}>
        <SurveyFormContent />
    </AdminGuard>
);

const SurveyFormContent: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { openSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(isEdit);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<DraftQuestion[]>([
        { ...EMPTY_QUESTION },
    ]);

    const loadDetail = () => {
        if (!id) return;
        setLoading(true);
        setLoadError(false);
        fetchSurveyDetail(id)
            .then(s => {
                setTitle(s.title);
                setDescription(s.description || "");
                setQuestions(
                    s.questions.length > 0
                        ? s.questions.map(q => ({
                              question: q.question,
                              type: q.type,
                              options: q.options?.length ? q.options : ["", ""],
                              required: q.required,
                          }))
                        : [{ ...EMPTY_QUESTION }],
                );
            })
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const updateQuestion = (index: number, patch: Partial<DraftQuestion>) => {
        setQuestions(prev =>
            prev.map((q, i) => (i === index ? { ...q, ...patch } : q)),
        );
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, { ...EMPTY_QUESTION }]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const updateOption = (qIndex: number, optIndex: number, value: string) => {
        setQuestions(prev =>
            prev.map((q, i) =>
                i === qIndex
                    ? {
                          ...q,
                          options: q.options.map((o, j) =>
                              j === optIndex ? value : o,
                          ),
                      }
                    : q,
            ),
        );
    };

    const addOption = (qIndex: number) => {
        setQuestions(prev =>
            prev.map((q, i) =>
                i === qIndex ? { ...q, options: [...q.options, ""] } : q,
            ),
        );
    };

    const removeOption = (qIndex: number, optIndex: number) => {
        setQuestions(prev =>
            prev.map((q, i) =>
                i === qIndex
                    ? {
                          ...q,
                          options: q.options.filter((_, j) => j !== optIndex),
                      }
                    : q,
            ),
        );
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            openSnackbar({ type: "error", text: "Vui lòng nhập tên khảo sát" });
            return;
        }
        if (questions.length === 0 || questions.some(q => !q.question.trim())) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập đầy đủ nội dung câu hỏi",
            });
            return;
        }
        for (const q of questions) {
            if (
                OPTIONS_TYPES.includes(q.type) &&
                q.options.filter(o => o.trim()).length < 2
            ) {
                openSnackbar({
                    type: "error",
                    text: `Câu hỏi "${q.question}" cần ít nhất 2 lựa chọn`,
                });
                return;
            }
        }

        const preparedQuestions: DraftQuestion[] = questions.map(q => ({
            question: q.question.trim(),
            type: q.type,
            required: q.required,
            options: OPTIONS_TYPES.includes(q.type)
                ? q.options.map(o => o.trim()).filter(Boolean)
                : [],
        }));

        const input: SurveyInput = {
            title: title.trim(),
            description: description.trim() || undefined,
            questions: preparedQuestions,
        };

        try {
            setSaving(true);
            if (isEdit && id) {
                await updateSurvey(id, input);
                openSnackbar({ type: "success", text: "Đã cập nhật khảo sát" });
            } else {
                await createSurvey(input);
                openSnackbar({ type: "success", text: "Đã tạo khảo sát" });
            }
            navigate("/admin/surveys", { animate: true });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSaving(false);
        }
    };

    if (isEdit && loading) {
        return (
            <PageLayout id="admin-survey-form" title="Sửa khảo sát">
                <LoadingState />
            </PageLayout>
        );
    }
    if (isEdit && loadError) {
        return (
            <PageLayout id="admin-survey-form" title="Sửa khảo sát">
                <ErrorState onRetry={loadDetail} />
            </PageLayout>
        );
    }

    return (
        <PageLayout
            id="admin-survey-form"
            title={isEdit ? "Sửa khảo sát" : "Thêm khảo sát"}
        >
            <Box p={4}>
                <Box className="bg-white rounded-2xl p-4 shadow-sm">
                    <Input
                        label="Tên khảo sát"
                        placeholder="Nhập tên khảo sát"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Box mt={3}>
                        <TextArea
                            label="Mô tả (nếu có)"
                            placeholder="Mô tả mục đích khảo sát"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Box>
                </Box>

                <Box mt={3}>
                    <Text.Title size="small" className="mb-2">
                        Danh sách câu hỏi
                    </Text.Title>

                    {questions.map((q, qIndex) => (
                        <Box
                            key={qIndex}
                            className="bg-white rounded-2xl p-4 shadow-sm mb-3"
                        >
                            <Box
                                flex
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Text
                                    size="xSmall"
                                    className="font-medium text-text_2"
                                >
                                    Câu hỏi {qIndex + 1}
                                </Text>
                                {questions.length > 1 && (
                                    <Box
                                        onClick={() => removeQuestion(qIndex)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Icon
                                            icon="zi-delete"
                                            className="text-red-500"
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Input
                                placeholder="Nhập nội dung câu hỏi"
                                value={q.question}
                                onChange={e =>
                                    updateQuestion(qIndex, {
                                        question: e.target.value,
                                    })
                                }
                            />

                            <Box mt={3}>
                                <Select
                                    label="Loại câu hỏi"
                                    value={q.type}
                                    onChange={val =>
                                        updateQuestion(qIndex, {
                                            type: val as LoaiCauHoiKhaoSat,
                                            options:
                                                OPTIONS_TYPES.includes(
                                                    val as LoaiCauHoiKhaoSat,
                                                ) && q.options.length < 2
                                                    ? ["", ""]
                                                    : q.options,
                                        })
                                    }
                                >
                                    {(
                                        Object.entries(
                                            LOAI_CAU_HOI_KHAO_SAT_LABEL,
                                        ) as [LoaiCauHoiKhaoSat, string][]
                                    ).map(([key, label]) => (
                                        <Select.Option
                                            key={key}
                                            value={key}
                                            title={label}
                                        />
                                    ))}
                                </Select>
                            </Box>

                            {OPTIONS_TYPES.includes(q.type) && (
                                <Box mt={3}>
                                    <Text
                                        size="xSmall"
                                        className="font-medium text-text_1 mb-1"
                                    >
                                        Các lựa chọn
                                    </Text>
                                    {q.options.map((opt, optIndex) => (
                                        <Box
                                            key={optIndex}
                                            flex
                                            alignItems="center"
                                            style={{ gap: 8 }}
                                            mb={2}
                                        >
                                            <Box style={{ flex: 1 }}>
                                                <Input
                                                    placeholder={`Lựa chọn ${
                                                        optIndex + 1
                                                    }`}
                                                    value={opt}
                                                    onChange={e =>
                                                        updateOption(
                                                            qIndex,
                                                            optIndex,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Box>
                                            {q.options.length > 2 && (
                                                <Box
                                                    onClick={() =>
                                                        removeOption(
                                                            qIndex,
                                                            optIndex,
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <Icon
                                                        icon="zi-close"
                                                        className="text-text_3"
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                    <Text
                                        size="xSmall"
                                        className="text-main font-medium"
                                        onClick={() => addOption(qIndex)}
                                    >
                                        + Thêm lựa chọn
                                    </Text>
                                </Box>
                            )}

                            <Box mt={3}>
                                <Checkbox
                                    label="Bắt buộc trả lời"
                                    value="required"
                                    checked={q.required}
                                    onChange={(checked: boolean) =>
                                        updateQuestion(qIndex, {
                                            required: checked,
                                        })
                                    }
                                />
                            </Box>
                        </Box>
                    ))}

                    <Button variant="secondary" fullWidth onClick={addQuestion}>
                        + Thêm câu hỏi
                    </Button>
                </Box>

                <Box mt={4}>
                    <Button fullWidth loading={saving} onClick={handleSubmit}>
                        {isEdit ? "Lưu thay đổi" : "Tạo khảo sát"}
                    </Button>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default SurveyFormPage;
