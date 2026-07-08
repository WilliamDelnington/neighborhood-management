import React, { useEffect, useState } from "react";
import { Box, Icon, Modal, Select, Sheet, useSnackbar } from "zmp-ui";
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
import { useStore } from "@store";
import { AppError, MucDoAnNinh } from "@dts";
import { LOAI_SO_HUU_LABEL, MUC_DO_AN_NINH_LABEL } from "@constants/domain";
import {
    SecurityRecord,
    createSecurityRecord,
    deleteSecurityRecord,
    fetchSecurityRecords,
    updateSecurityRecord,
} from "@service/securityApi";
import SecurityForm, {
    EMPTY_SECURITY_FORM,
    SecurityFormValues,
    isSecurityFormValid,
    toSecurityInput,
} from "./SecurityForm";

const VIEW_ROLES = [
    "admin",
    "neighborhood_leader",
    "regional_police",
    "people_committee_official",
] as const;

const LEVEL_TONE: Record<MucDoAnNinh, BadgeTone> = {
    binh_thuong: "green",
    can_theo_doi: "yellow",
    khan_cap: "red",
};

const householdText = (h: SecurityRecord["householdId"]) =>
    typeof h === "string" ? h : `${h.code} — ${h.address}`;

const householdIdOf = (h: SecurityRecord["householdId"]) =>
    typeof h === "string" ? h : h._id;

const recordToForm = (r: SecurityRecord): SecurityFormValues => ({
    householdId: householdIdOf(r.householdId),
    householdLabel: householdText(r.householdId),
    ownershipType: r.ownershipType,
    renterCount: r.renterCount ? String(r.renterCount) : "",
    temporaryResidenceDeclared: r.temporaryResidenceDeclared,
    hasCamera: r.hasCamera,
    hasSecurityComplaint: r.hasSecurityComplaint,
    level: r.level,
    reportedToPolice: r.reportedToPolice,
    handlingStatus: r.handlingStatus || "",
    note: r.note || "",
});

const SecurityListPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <SecurityListContent />
    </AdminGuard>
);

const SecurityListContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const user = useStore(state => state.user);
    const canManage =
        !!user &&
        (user.roles.includes("admin") ||
            user.roles.includes("neighborhood_leader") ||
            user.roles.includes("regional_police"));

    const [level, setLevel] = useState<MucDoAnNinh | "">("");
    const [items, setItems] = useState<SecurityRecord[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [formVisible, setFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<SecurityFormValues>(EMPTY_SECURITY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const load = (targetPage = 1) => {
        if (targetPage === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(false);
        fetchSecurityRecords({ page: targetPage, level: level || undefined })
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
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_SECURITY_FORM);
        setFormVisible(true);
    };

    const openEdit = (r: SecurityRecord) => {
        setEditingId(r._id);
        setForm(recordToForm(r));
        setFormVisible(true);
    };

    const handleSubmit = async () => {
        if (!isSecurityFormValid(form)) {
            openSnackbar({ type: "error", text: "Vui lòng chọn hộ dân" });
            return;
        }
        try {
            setSubmitting(true);
            if (editingId) {
                await updateSecurityRecord(editingId, toSecurityInput(form));
                openSnackbar({
                    type: "success",
                    text: "Đã cập nhật hồ sơ an ninh",
                });
            } else {
                await createSecurityRecord(toSecurityInput(form));
                openSnackbar({
                    type: "success",
                    text: "Đã thêm hồ sơ an ninh",
                });
            }
            setFormVisible(false);
            load(1);
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
            await deleteSecurityRecord(confirmDeleteId);
            openSnackbar({ type: "success", text: "Đã xóa hồ sơ an ninh" });
            setConfirmDeleteId(null);
            setFormVisible(false);
            load(1);
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <PageLayout
            id="admin-security-list"
            title="An ninh, tạm trú, nhà cho thuê"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Select
                    label="Lọc theo mức độ"
                    closeOnSelect
                    value={level}
                    onChange={v => setLevel((v as MucDoAnNinh) || "")}
                >
                    <Select.Option title="Tất cả mức độ" value="" />
                    {(
                        Object.entries(MUC_DO_AN_NINH_LABEL) as [
                            MucDoAnNinh,
                            string,
                        ][]
                    ).map(([key, label]) => (
                        <Select.Option key={key} title={label} value={key} />
                    ))}
                </Select>

                <Box className="bg-white rounded-2xl px-4 mt-3 shadow-sm">
                    {loading && <LoadingState />}
                    {!loading && error && (
                        <ErrorState onRetry={() => load(1)} />
                    )}
                    {!loading && !error && items.length === 0 && (
                        <EmptyState label="Chưa có hồ sơ an ninh nào" />
                    )}
                    {!loading &&
                        !error &&
                        items.map(r => (
                            <ListRow
                                key={r._id}
                                title={householdText(r.householdId)}
                                subtitle={`${r.renterCount || 0} người thuê • ${
                                    LOAI_SO_HUU_LABEL[r.ownershipType]
                                }`}
                                right={
                                    <StatusBadge
                                        label={MUC_DO_AN_NINH_LABEL[r.level]}
                                        tone={LEVEL_TONE[r.level]}
                                    />
                                }
                                onClick={() => openEdit(r)}
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
                title={editingId ? "Sửa hồ sơ an ninh" : "Thêm hồ sơ an ninh"}
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
                        <SecurityForm values={form} onChange={setForm} />
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
                            {editingId ? "Lưu thay đổi" : "Thêm hồ sơ"}
                        </Button>
                        {canManage && editingId && (
                            <Button
                                variant="secondary"
                                fullWidth
                                className="!text-red-500"
                                onClick={() => setConfirmDeleteId(editingId)}
                            >
                                Xóa hồ sơ
                            </Button>
                        )}
                    </Box>
                </Box>
            </Sheet>

            <Modal
                visible={!!confirmDeleteId}
                title="Xóa hồ sơ an ninh?"
                description="Bạn có chắc muốn xóa hồ sơ này? Hành động này không thể hoàn tác."
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

export default SecurityListPage;
