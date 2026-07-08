import React, { useEffect, useState } from "react";
import { Box, Icon, Modal, Sheet, useSnackbar } from "zmp-ui";
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
import { AppError, Citizen, Household } from "@dts";
import {
    createCitizen,
    deleteCitizen,
    fetchCitizens,
    updateCitizen,
} from "@service/citizenApi";
import CitizenForm, {
    CitizenFormValues,
    EMPTY_CITIZEN_FORM,
    isCitizenFormValid,
    toCitizenInput,
} from "./CitizenForm";

const VIEW_ROLES = [
    "admin",
    "neighborhood_leader",
    "secretary",
    "regional_police",
    "people_committee_official",
] as const;

const householdLabelOf = (h: string | Household): string =>
    typeof h === "string" ? "" : `${h.code} — ${h.address}`;

const householdIdOf = (h: string | Household): string =>
    typeof h === "string" ? h : h._id;

const citizenToForm = (c: Citizen): CitizenFormValues => ({
    fullName: c.fullName,
    phone: c.phone || "",
    cccd: c.cccd || "",
    birthDate: c.birthDate ? new Date(c.birthDate) : null,
    gender: c.gender,
    relationToHead: c.relationToHead || "",
    householdId: householdIdOf(c.householdId),
    householdLabel: householdLabelOf(c.householdId),
    residenceType: c.residenceType,
    isElderly: c.isElderly,
    isChild: c.isChild,
    isDisabledOrSupportNeeded: c.isDisabledOrSupportNeeded,
    isPartyMember: c.isPartyMember,
    isUnionMember: c.isUnionMember,
});

const CitizenListPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <CitizenListContent />
    </AdminGuard>
);

const CitizenListContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const user = useStore(state => state.user);
    const canManage =
        !!user &&
        (user.roles.includes("admin") ||
            user.roles.includes("neighborhood_leader"));

    const [search, setSearch] = useState("");
    const [items, setItems] = useState<Citizen[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [formVisible, setFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CitizenFormValues>(EMPTY_CITIZEN_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const load = (targetPage = 1, keyword = search) => {
        if (targetPage === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(false);
        fetchCitizens({ page: targetPage, search: keyword })
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
        setEditingId(null);
        setForm(EMPTY_CITIZEN_FORM);
        setFormVisible(true);
    };

    const openEdit = (c: Citizen) => {
        setEditingId(c._id);
        setForm(citizenToForm(c));
        setFormVisible(true);
    };

    const handleSubmit = async () => {
        if (!isCitizenFormValid(form)) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập họ tên và chọn hộ dân",
            });
            return;
        }
        try {
            setSubmitting(true);
            if (editingId) {
                await updateCitizen(editingId, toCitizenInput(form));
                openSnackbar({
                    type: "success",
                    text: "Đã cập nhật nhân khẩu",
                });
            } else {
                await createCitizen(toCitizenInput(form));
                openSnackbar({
                    type: "success",
                    text: "Đã thêm nhân khẩu mới",
                });
            }
            setFormVisible(false);
            load(1, search);
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            setDeleting(true);
            await deleteCitizen(confirmDeleteId);
            openSnackbar({ type: "success", text: "Đã xóa nhân khẩu" });
            setConfirmDeleteId(null);
            setFormVisible(false);
            load(1, search);
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setDeleting(false);
        }
    };

    const badgeFor = (c: Citizen) => {
        if (c.isDisabledOrSupportNeeded)
            return <StatusBadge label="Cần hỗ trợ" tone="red" />;
        if (c.isElderly) return <StatusBadge label="Cao tuổi" tone="yellow" />;
        if (c.isChild) return <StatusBadge label="Trẻ em" tone="blue" />;
        return undefined;
    };

    return (
        <PageLayout
            id="admin-citizen-list"
            title="Quản lý nhân khẩu"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Input
                    placeholder="Tìm theo họ tên, CCCD, số điện thoại..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <Box className="bg-white rounded-2xl px-4 mt-3 shadow-sm">
                    {loading && <LoadingState />}
                    {!loading && error && (
                        <ErrorState onRetry={() => load(1, search)} />
                    )}
                    {!loading && !error && items.length === 0 && (
                        <EmptyState label="Chưa có nhân khẩu nào" />
                    )}
                    {!loading &&
                        !error &&
                        items.map(c => (
                            <ListRow
                                key={c._id}
                                title={c.fullName}
                                subtitle={
                                    c.cccd || c.phone || "Chưa có CCCD/SĐT"
                                }
                                right={badgeFor(c)}
                                onClick={() => openEdit(c)}
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
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                title={editingId ? "Sửa nhân khẩu" : "Thêm nhân khẩu"}
                height="90vh"
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
                        <CitizenForm values={form} onChange={setForm} />
                    </Box>
                    <Box
                        mt={3}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <Button
                            fullWidth
                            loading={submitting}
                            onClick={handleSubmit}
                        >
                            {editingId ? "Lưu thay đổi" : "Thêm nhân khẩu"}
                        </Button>
                        {canManage && editingId && (
                            <Button
                                variant="secondary"
                                fullWidth
                                className="!text-red-500"
                                onClick={() => setConfirmDeleteId(editingId)}
                            >
                                Xóa nhân khẩu
                            </Button>
                        )}
                    </Box>
                </Box>
            </Sheet>

            <Modal
                visible={!!confirmDeleteId}
                title="Xóa nhân khẩu?"
                description="Bạn có chắc muốn xóa nhân khẩu này? Hành động này không thể hoàn tác."
                onClose={() => setConfirmDeleteId(null)}
                actions={[
                    {
                        text: "Hủy",
                        close: true,
                        onClick: () => setConfirmDeleteId(null),
                    },
                    {
                        text: "Xóa",
                        danger: true,
                        onClick: handleDelete,
                        disabled: deleting,
                    },
                ]}
            />
        </PageLayout>
    );
};

export default CitizenListPage;
