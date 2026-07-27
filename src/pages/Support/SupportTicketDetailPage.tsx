import React, { useEffect, useState } from "react";
import { Box, Text, useParams } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { ErrorState, LoadingState, StatusBadge } from "@components/admin";
import { RequireAuth } from "@components/role";
import { fetchSupportTicketDetail } from "@service/supportTicketApi";
import {
    LOAI_YEU_CAU_HO_TRO_LABEL,
    TRANG_THAI_YEU_CAU_HO_TRO_LABEL,
    TRANG_THAI_YEU_CAU_HO_TRO_TONE,
} from "@constants/domain";
import { formatDateTime } from "@utils/date-time";
import { SupportTicket } from "@dts";

const SupportTicketDetailPage: React.FC = () => (
    <RequireAuth>
        <SupportTicketDetailPageContent />
    </RequireAuth>
);

const SupportTicketDetailPageContent: React.FC = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setErrorMessage(null);
        fetchSupportTicketDetail(id)
            .then(setTicket)
            .catch(err =>
                setErrorMessage(
                    err?.message || "Không thể tải chi tiết yêu cầu hỗ trợ",
                ),
            )
            .finally(() => setLoading(false));
    };

    useEffect(load, [id]);

    return (
        <PageLayout id="support-ticket-detail-page" title="Chi tiết yêu cầu">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && errorMessage && (
                    <ErrorState label={errorMessage} onRetry={load} />
                )}
                {!loading && !errorMessage && ticket && (
                    <Box>
                        <Box className="bg-white rounded-2xl p-4 shadow-sm">
                            <Box
                                flex
                                justifyContent="space-between"
                                alignItems="flex-start"
                                mb={2}
                            >
                                <Text
                                    size="xSmall"
                                    className="text-main font-medium"
                                >
                                    {ticket.code}
                                </Text>
                                <StatusBadge
                                    label={
                                        TRANG_THAI_YEU_CAU_HO_TRO_LABEL[
                                            ticket.status
                                        ]
                                    }
                                    tone={
                                        TRANG_THAI_YEU_CAU_HO_TRO_TONE[
                                            ticket.status
                                        ]
                                    }
                                />
                            </Box>
                            <Text.Title size="small">{ticket.title}</Text.Title>
                            <Text size="xxSmall" className="text-text_2 mt-1">
                                {LOAI_YEU_CAU_HO_TRO_LABEL[ticket.type]}
                            </Text>
                            <Text
                                size="small"
                                className="mt-3 whitespace-pre-line"
                            >
                                {ticket.content}
                            </Text>
                            <Text size="xxSmall" className="text-text_2 mt-3">
                                Gửi lúc:{" "}
                                {formatDateTime(new Date(ticket.createdAt))}
                            </Text>
                        </Box>

                        <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                            <Text.Title size="small" className="mb-2">
                                Phản hồi từ quản trị viên
                            </Text.Title>
                            {ticket.adminResponse ? (
                                <Text
                                    size="xSmall"
                                    className="whitespace-pre-line"
                                >
                                    {ticket.adminResponse}
                                </Text>
                            ) : (
                                <Text size="xSmall" className="text-text_2">
                                    Chưa có phản hồi cho yêu cầu này.
                                </Text>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default SupportTicketDetailPage;
