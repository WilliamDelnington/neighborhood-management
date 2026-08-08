import React, { useEffect, useState } from "react";
import { Box, useParams } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { ErrorState, LoadingState } from "@components/admin";
import { RequireAuth } from "@components/role";
import AttachmentUploader from "@components/attachments/AttachmentUploader";
import {
    fetchComplaintAttachments,
    fetchComplaintDetail,
    deleteComplaintAttachment,
} from "@service/complaintApi";
import { ComplaintDetail } from "@dts";
import { useStore } from "@store";
import ComplaintTimelineView from "./ComplaintTimelineView";

const ComplaintDetailPage: React.FC = () => (
    <RequireAuth>
        <ComplaintDetailPageContent />
    </RequireAuth>
);

const ComplaintDetailPageContent: React.FC = () => {
    const { id } = useParams();
    const user = useStore(state => state.user);
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

    const isOwner = !!(
        user &&
        detail &&
        String(
            typeof detail.complaint.createdByUserId === "object"
                ? detail.complaint.createdByUserId._id
                : detail.complaint.createdByUserId,
        ) === String(user.id)
    );

    return (
        <PageLayout id="complaint-detail-page" title="Chi tiết phản ánh">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && errorMessage && (
                    <ErrorState label={errorMessage} onRetry={load} />
                )}
                {!loading && !errorMessage && detail && (
                    <>
                        <ComplaintTimelineView
                            complaint={detail.complaint}
                            timeline={detail.timeline}
                        />
                        <AttachmentUploader
                            relatedModel="Complaint"
                            relatedId={detail.complaint._id}
                            canUpload={isOwner}
                            canDelete={isOwner}
                            fetchAttachments={fetchComplaintAttachments}
                            deleteAttachmentFn={deleteComplaintAttachment}
                        />
                    </>
                )}
            </Box>
        </PageLayout>
    );
};

export default ComplaintDetailPage;
