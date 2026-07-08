import React, { useEffect, useState } from "react";
import { Box, Text, useParams } from "zmp-ui";
import { PageLayout } from "@components/layout";
import {
    AdminGuard,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { fetchSurveyResults, SurveyResults } from "@service/surveyApi";

const BarRow: React.FC<{ label: string; count: number; max: number }> = ({
    label,
    count,
    max,
}) => (
    <Box mb={3}>
        <Box flex justifyContent="space-between" mb={1}>
            <Text size="xSmall" className="flex-1 pr-2">
                {label}
            </Text>
            <Text size="xSmall" className="font-medium text-main">
                {count}
            </Text>
        </Box>
        <Box
            className="bg-ng_10 rounded-full"
            style={{ height: 8, overflow: "hidden" }}
        >
            <Box
                className="bg-main rounded-full"
                style={{
                    height: 8,
                    width: `${
                        max > 0 ? Math.min(100, (count / max) * 100) : 0
                    }%`,
                }}
            />
        </Box>
    </Box>
);

const SurveyResultsPage: React.FC = () => (
    <AdminGuard roles={["admin", "secretary"]}>
        <SurveyResultsContent />
    </AdminGuard>
);

const SurveyResultsContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [results, setResults] = useState<SurveyResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setError(false);
        fetchSurveyResults(id)
            .then(setResults)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(load, [id]);

    return (
        <PageLayout id="admin-survey-results" title="Kết quả khảo sát">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && error && <ErrorState onRetry={load} />}

                {!loading && !error && results && (
                    <>
                        <Box className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                            <Text.Title size="small">
                                {results.title}
                            </Text.Title>
                            <Text size="xSmall" className="text-text_2 mt-1">
                                Tổng số lượt trả lời: {results.totalResponses}
                            </Text>
                        </Box>

                        {results.results.length === 0 && (
                            <EmptyState label="Chưa có câu hỏi nào" />
                        )}

                        {results.results.map(r => (
                            <Box
                                key={r.questionId}
                                className="bg-white rounded-2xl p-4 shadow-sm mb-3"
                            >
                                <Text.Title size="small" className="mb-3">
                                    {r.question}
                                </Text.Title>

                                {Object.keys(r.optionCounts || {}).length ===
                                    0 &&
                                    r.otherTexts.length === 0 && (
                                        <Text
                                            size="xSmall"
                                            className="text-text_2"
                                        >
                                            Chưa có câu trả lời
                                        </Text>
                                    )}

                                {Object.entries(r.optionCounts || {}).map(
                                    ([option, count]) => (
                                        <BarRow
                                            key={option}
                                            label={option}
                                            count={count}
                                            max={Math.max(
                                                results.totalResponses,
                                                1,
                                            )}
                                        />
                                    ),
                                )}

                                {r.otherTexts.length > 0 && (
                                    <Box mt={2}>
                                        <Text
                                            size="xSmall"
                                            className="font-medium text-text_2 mb-2"
                                        >
                                            Ý kiến khác
                                        </Text>
                                        {r.otherTexts.map((text, idx) => (
                                            <Text
                                                key={idx}
                                                size="xSmall"
                                                className="text-text_1 mb-2 italic"
                                            >
                                                “{text}”
                                            </Text>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </>
                )}
            </Box>
        </PageLayout>
    );
};

export default SurveyResultsPage;
