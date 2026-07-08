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
    BadgeTone,
} from "@components/admin";
import { Button } from "@components/customized";
import { fetchSurveys, openSurvey, closeSurvey } from "@service/surveyApi";
import { Survey } from "@dts";

/**
 * Trang thai khao sat khong nam trong @constants/domain nen dinh nghia rieng tai day.
 */
const SURVEY_STATUS_LABEL: Record<Survey["status"], string> = {
    nhap: "Nháp",
    dang_mo: "Đang mở",
    da_dong: "Đã đóng",
};

const SURVEY_STATUS_TONE: Record<Survey["status"], BadgeTone> = {
    nhap: "gray",
    dang_mo: "green",
    da_dong: "blue",
};

const SurveyAdminListPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary"]}>
        <PageLayout
            id="admin-surveys"
            title="Quản lý khảo sát"
            bottomNav={<AppBottomNav />}
        >
            <SurveyAdminListContent />
        </PageLayout>
    </AdminGuard>
);

const SurveyAdminListContent: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [actingId, setActingId] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchSurveys(false)
            .then(res => {
                setSurveys(res.items);
                setTotal(res.total);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleToggle = async (e: React.MouseEvent, survey: Survey) => {
        e.stopPropagation();
        try {
            setActingId(survey._id);
            if (survey.status === "dang_mo") {
                await closeSurvey(survey._id);
                openSnackbar({ type: "success", text: "Đã đóng khảo sát" });
            } else {
                await openSurvey(survey._id);
                openSnackbar({ type: "success", text: "Đã mở khảo sát" });
            }
            load();
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setActingId(null);
        }
    };

    return (
        <Box p={4}>
            <Box flex alignItems="center" justifyContent="space-between" mb={3}>
                <Text.Title size="small">
                    Khảo sát {total > 0 ? `(${total})` : ""}
                </Text.Title>
                <Button
                    size="small"
                    prefixIcon={<Icon icon="zi-plus" />}
                    onClick={() =>
                        navigate("/admin/surveys/create", { animate: true })
                    }
                >
                    Thêm mới
                </Button>
            </Box>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState onRetry={load} />}
            {!loading && !error && surveys.length === 0 && (
                <EmptyState label="Chưa có khảo sát nào được tạo" />
            )}

            {!loading && !error && surveys.length > 0 && (
                <Box className="bg-white rounded-2xl px-4 shadow-sm">
                    {surveys.map(s => (
                        <ListRow
                            key={s._id}
                            title={s.title}
                            subtitle={`${SURVEY_STATUS_LABEL[s.status]} · ${
                                s.questions.length
                            } câu hỏi`}
                            right={
                                <Box
                                    flex
                                    alignItems="center"
                                    style={{ gap: 8 }}
                                >
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        onClick={e => {
                                            e.stopPropagation();
                                            navigate(
                                                `/admin/surveys/${s._id}/results`,
                                                {
                                                    animate: true,
                                                },
                                            );
                                        }}
                                    >
                                        Kết quả
                                    </Button>
                                    {s.status !== "da_dong" && (
                                        <Button
                                            size="small"
                                            loading={actingId === s._id}
                                            onClick={e => handleToggle(e, s)}
                                        >
                                            {s.status === "dang_mo"
                                                ? "Đóng"
                                                : "Mở"}
                                        </Button>
                                    )}
                                    <StatusBadge
                                        label={SURVEY_STATUS_LABEL[s.status]}
                                        tone={SURVEY_STATUS_TONE[s.status]}
                                    />
                                </Box>
                            }
                            onClick={() =>
                                navigate(`/admin/surveys/${s._id}/edit`, {
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

export default SurveyAdminListPage;
