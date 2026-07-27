import React, { useEffect, useState } from "react";
import { Box, useParams } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { ErrorState, LoadingState } from "@components/admin";
import { RequireAuth } from "@components/role";
import { fetchComplaintDetail } from "@service/complaintApi";
import { ComplaintDetail } from "@dts";
import ComplaintTimelineView from "./ComplaintTimelineView";

const ComplaintDetailPage: React.FC = () => (
    <RequireAuth>
        <ComplaintDetailPageContent />
    </RequireAuth>
);

const ComplaintDetailPageContent: React.FC = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState<ComplaintDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setErrorMessage(null);
        fetchComplaintDetail(id)
            .then(setDetail)
            .catch(err =>
                setErrorMessage(
                    err?.message || "Không thể tải chi tiết phản ánh",
                ),
            )
            .finally(() => setLoading(false));
    };

    useEffect(load, [id]);

    return (
        <PageLayout id="complaint-detail-page" title="Chi tiết phản ánh">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && errorMessage && (
                    <ErrorState label={errorMessage} onRetry={load} />
                )}
                {!loading && !errorMessage && detail && (
                    <ComplaintTimelineView
                        complaint={detail.complaint}
                        timeline={detail.timeline}
                    />
                )}
            </Box>
        </PageLayout>
    );
};

export default ComplaintDetailPage;
