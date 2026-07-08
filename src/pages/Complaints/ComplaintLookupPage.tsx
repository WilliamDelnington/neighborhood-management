import React, { useEffect, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import { Button, Input } from "@components/customized";
import {
    EmptyState,
    ErrorState,
    ListRow,
    LoadingState,
    StatusBadge,
} from "@components/admin";
import { useStore } from "@store";
import {
    fetchMyComplaints,
    lookupComplaintByCode,
} from "@service/complaintApi";
import {
    TRANG_THAI_PHAN_ANH_LABEL,
    TRANG_THAI_PHAN_ANH_TONE,
} from "@constants/domain";
import { Complaint, ComplaintDetail } from "@dts";
import ComplaintTimelineView from "./ComplaintTimelineView";

const ComplaintLookupPage: React.FC = () => {
    const navigate = useNavigate();
    const token = useStore(state => state.token);

    const [code, setCode] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [result, setResult] = useState<ComplaintDetail | null>(null);

    const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
    const [myLoading, setMyLoading] = useState(false);
    const [myError, setMyError] = useState(false);

    const loadMyComplaints = () => {
        setMyLoading(true);
        setMyError(false);
        fetchMyComplaints()
            .then(res => setMyComplaints(res.items))
            .catch(() => setMyError(true))
            .finally(() => setMyLoading(false));
    };

    useEffect(() => {
        if (token) {
            loadMyComplaints();
        }
    }, [token]);

    const handleSearch = async () => {
        if (!code.trim()) {
            setSearchError("Vui lòng nhập mã phản ánh");
            return;
        }
        try {
            setSearching(true);
            setSearchError(null);
            setResult(null);
            const detail = await lookupComplaintByCode(code.trim());
            setResult(detail);
        } catch (err: any) {
            setResult(null);
            setSearchError(
                err?.message || "Không tìm thấy phản ánh với mã này",
            );
        } finally {
            setSearching(false);
        }
    };

    return (
        <PageLayout
            id="complaint-lookup-page"
            title="Tra cứu phản ánh"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Box className="bg-white rounded-2xl p-4 shadow-sm">
                    <Text.Title size="small" className="mb-2">
                        Tra cứu theo mã phản ánh
                    </Text.Title>
                    <Input
                        placeholder="VD: HB-PA-2026-0001"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />
                    <Box mt={3}>
                        <Button
                            fullWidth
                            loading={searching}
                            onClick={handleSearch}
                        >
                            Tra cứu
                        </Button>
                    </Box>
                    {searchError && (
                        <Text size="xSmall" className="text-red-500 mt-2">
                            {searchError}
                        </Text>
                    )}
                </Box>

                {result && (
                    <Box mt={3}>
                        <ComplaintTimelineView
                            complaint={result.complaint}
                            timeline={result.timeline}
                        />
                    </Box>
                )}

                {token && (
                    <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                        <Text.Title size="small" className="mb-2">
                            Phản ánh của tôi
                        </Text.Title>

                        {myLoading && <LoadingState />}
                        {!myLoading && myError && (
                            <ErrorState onRetry={loadMyComplaints} />
                        )}
                        {!myLoading &&
                            !myError &&
                            myComplaints.length === 0 && (
                                <EmptyState label="Bạn chưa gửi phản ánh nào" />
                            )}
                        {!myLoading &&
                            !myError &&
                            myComplaints.map(item => (
                                <ListRow
                                    key={item._id}
                                    title={item.title}
                                    subtitle={item.code}
                                    right={
                                        <StatusBadge
                                            label={
                                                TRANG_THAI_PHAN_ANH_LABEL[
                                                    item.status
                                                ]
                                            }
                                            tone={
                                                TRANG_THAI_PHAN_ANH_TONE[
                                                    item.status
                                                ]
                                            }
                                        />
                                    }
                                    onClick={() =>
                                        navigate(`/complaints/${item._id}`, {
                                            animate: true,
                                        })
                                    }
                                />
                            ))}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default ComplaintLookupPage;
