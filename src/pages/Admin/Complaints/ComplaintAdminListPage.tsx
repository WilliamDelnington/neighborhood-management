import React, { useEffect, useState } from "react";
import { Box, Select, useNavigate } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatusBadge,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button, Input } from "@components/customized";
import { Complaint, NhomPhanAnh, TrangThaiPhanAnh } from "@dts";
import { fetchComplaints } from "@service/complaintApi";
import {
    NHOM_PHAN_ANH_LABEL,
    TRANG_THAI_PHAN_ANH_LABEL,
    TRANG_THAI_PHAN_ANH_TONE,
} from "@constants/domain";

const VIEW_ROLES = [
    "admin",
    "neighborhood_leader",
    "regional_police",
    "people_committee_official",
] as const;

const ComplaintAdminListPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <ComplaintAdminListContent />
    </AdminGuard>
);

const ComplaintAdminListContent: React.FC = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TrangThaiPhanAnh | "">("");
    const [category, setCategory] = useState<NhomPhanAnh | "">("");

    const [items, setItems] = useState<Complaint[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const load = (targetPage = 1) => {
        if (targetPage === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(false);
        fetchComplaints({
            page: targetPage,
            search,
            status: status || undefined,
            category: category || undefined,
        })
            .then(res => {
                setItems(prev =>
                    targetPage === 1 ? res.items : [...prev, ...res.items],
                );
                setPage(res.page);
                setTotalPages(res.totalPages);
            })
            .catch(() => setError(true))
            .finally(() => {
                setLoading(false);
                setLoadingMore(false);
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => load(1), 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, status, category]);

    return (
        <PageLayout
            id="admin-complaint-list"
            title="Phản ánh kiến nghị"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Input
                    placeholder="Tìm theo mã phản ánh, tiêu đề..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <Box flex mt={3} style={{ gap: 10 }}>
                    <Box style={{ flex: 1 }}>
                        <Select
                            placeholder="Tất cả trạng thái"
                            closeOnSelect
                            value={status}
                            onChange={v =>
                                setStatus((v as TrangThaiPhanAnh) || "")
                            }
                        >
                            <Select.Option title="Tất cả trạng thái" value="" />
                            {(
                                Object.entries(TRANG_THAI_PHAN_ANH_LABEL) as [
                                    TrangThaiPhanAnh,
                                    string,
                                ][]
                            ).map(([key, label]) => (
                                <Select.Option
                                    key={key}
                                    title={label}
                                    value={key}
                                />
                            ))}
                        </Select>
                    </Box>
                    <Box style={{ flex: 1 }}>
                        <Select
                            placeholder="Tất cả nhóm"
                            closeOnSelect
                            value={category}
                            onChange={v =>
                                setCategory((v as NhomPhanAnh) || "")
                            }
                        >
                            <Select.Option title="Tất cả nhóm" value="" />
                            {(
                                Object.entries(NHOM_PHAN_ANH_LABEL) as [
                                    NhomPhanAnh,
                                    string,
                                ][]
                            ).map(([key, label]) => (
                                <Select.Option
                                    key={key}
                                    title={label}
                                    value={key}
                                />
                            ))}
                        </Select>
                    </Box>
                </Box>

                <Box className="bg-white rounded-2xl px-4 mt-3 shadow-sm">
                    {loading && <LoadingState />}
                    {!loading && error && (
                        <ErrorState onRetry={() => load(1)} />
                    )}
                    {!loading && !error && items.length === 0 && (
                        <EmptyState label="Không có phản ánh nào phù hợp" />
                    )}
                    {!loading &&
                        !error &&
                        items.map(c => (
                            <ListRow
                                key={c._id}
                                title={`${c.code} — ${c.title}`}
                                subtitle={NHOM_PHAN_ANH_LABEL[c.category]}
                                right={
                                    <StatusBadge
                                        label={
                                            TRANG_THAI_PHAN_ANH_LABEL[c.status]
                                        }
                                        tone={
                                            TRANG_THAI_PHAN_ANH_TONE[c.status]
                                        }
                                    />
                                }
                                onClick={() =>
                                    navigate(`/admin/complaints/${c._id}`, {
                                        animate: true,
                                    })
                                }
                            />
                        ))}
                </Box>

                {!loading && !error && page < totalPages && (
                    <Box mt={3}>
                        <Button
                            variant="secondary"
                            fullWidth
                            loading={loadingMore}
                            onClick={() => load(page + 1)}
                        >
                            Xem thêm
                        </Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default ComplaintAdminListPage;
