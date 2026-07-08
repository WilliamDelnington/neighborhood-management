import React, { useEffect, useState } from "react";
import { Box, Icon, Sheet, useNavigate, useSnackbar } from "zmp-ui";
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
import { useStore } from "@store";
import { Household, AppError } from "@dts";
import { createHousehold, fetchHouseholds } from "@service/householdApi";
import HouseholdForm, {
    EMPTY_HOUSEHOLD_FORM,
    HouseholdFormValues,
    isHouseholdFormValid,
    toHouseholdInput,
} from "./HouseholdForm";

const VIEW_ROLES = [
    "admin",
    "neighborhood_leader",
    "secretary",
    "regional_police",
    "people_committee_official",
] as const;

const HouseholdListPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <HouseholdListContent />
    </AdminGuard>
);

const HouseholdListContent: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const user = useStore(state => state.user);
    const canManage =
        !!user &&
        (user.roles.includes("admin") ||
            user.roles.includes("neighborhood_leader"));

    const [search, setSearch] = useState("");
    const [items, setItems] = useState<Household[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [createVisible, setCreateVisible] = useState(false);
    const [form, setForm] = useState<HouseholdFormValues>(EMPTY_HOUSEHOLD_FORM);
    const [submitting, setSubmitting] = useState(false);

    const load = (targetPage = 1, keyword = search) => {
        if (targetPage === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(false);
        fetchHouseholds({ page: targetPage, search: keyword })
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
        const timer = setTimeout(() => load(1, search), 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const openCreate = () => {
        setForm(EMPTY_HOUSEHOLD_FORM);
        setCreateVisible(true);
    };

    const handleCreate = async () => {
        if (!isHouseholdFormValid(form)) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập đầy đủ cụm dân cư, địa chỉ, chủ hộ",
            });
            return;
        }
        try {
            setSubmitting(true);
            await createHousehold(toHouseholdInput(form));
            openSnackbar({ type: "success", text: "Đã thêm hộ dân mới" });
            setCreateVisible(false);
            load(1, search);
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageLayout
            id="admin-household-list"
            title="Quản lý hộ dân"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Input
                    placeholder="Tìm theo mã hộ, chủ hộ, địa chỉ..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <Box className="bg-white rounded-2xl px-4 mt-3 shadow-sm">
                    {loading && <LoadingState />}
                    {!loading && error && (
                        <ErrorState onRetry={() => load(1, search)} />
                    )}
                    {!loading && !error && items.length === 0 && (
                        <EmptyState label="Chưa có hộ dân nào" />
                    )}
                    {!loading &&
                        !error &&
                        items.map(h => (
                            <ListRow
                                key={h._id}
                                title={`${h.code} — ${h.headOfHousehold}`}
                                subtitle={h.address}
                                right={
                                    h.needsSupport ? (
                                        <StatusBadge
                                            label="Cần hỗ trợ"
                                            tone="yellow"
                                        />
                                    ) : undefined
                                }
                                onClick={() =>
                                    navigate(`/admin/households/${h._id}`, {
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
                            onClick={() => load(page + 1, search)}
                        >
                            Xem thêm
                        </Button>
                    </Box>
                )}
            </Box>

            {canManage && (
                <Box
                    className="bg-main"
                    style={{
                        position: "fixed",
                        right: 16,
                        bottom: 76,
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
                        zIndex: 20,
                    }}
                    onClick={openCreate}
                >
                    <Icon icon="zi-plus" className="text-white" />
                </Box>
            )}

            <Sheet
                visible={createVisible}
                onClose={() => setCreateVisible(false)}
                title="Thêm hộ dân"
                height="85vh"
                autoHeight={false}
            >
                <Box
                    p={4}
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box style={{ flex: 1, overflowY: "auto" }}>
                        <HouseholdForm values={form} onChange={setForm} />
                    </Box>
                    <Box mt={3}>
                        <Button
                            fullWidth
                            loading={submitting}
                            onClick={handleCreate}
                        >
                            Lưu hộ dân
                        </Button>
                    </Box>
                </Box>
            </Sheet>
        </PageLayout>
    );
};

export default HouseholdListPage;
