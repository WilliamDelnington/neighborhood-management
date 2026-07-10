import React, { useEffect, useState } from "react";
import { Box, Icon, Modal, Select, Sheet, useSnackbar } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatCard,
    StatusBadge,
    LoadingState,
    EmptyState,
    ErrorState,
    BadgeTone,
} from "@components/admin";
import { Button } from "@components/customized";
import { useStore } from "@store";
import { AppError, MucNguyCoPccc } from "@dts";
import { MUC_NGUY_CO_PCCC_LABEL } from "@constants/domain";
import {
    PcccCheck,
    createPcccCheck,
    deletePcccCheck,
    fetchPcccChecks,
    fetchPcccRiskSummary,
    updatePcccCheck,
} from "@service/pcccApi";
import PcccForm, {
    EMPTY_PCCC_FORM,
    PcccFormValues,
    isPcccFormValid,
    toPcccInput,
} from "./PcccForm";

const VIEW_ROLES = [
    "admin",
    "neighborhood_leader",
    "regional_police",
    "people_committee_official",
] as const;

const RISK_TONE: Record<MucNguyCoPccc, BadgeTone> = {
    xanh: "green",
    vang: "yellow",
    do: "red",
};

const householdText = (h: PcccCheck["householdId"]) =>
    typeof h === "string" ? h : `${h.code} — ${h.address}`;

const householdIdOf = (h: PcccCheck["householdId"]) =>
    typeof h === "string" ? h : h._id;

const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("vi-VN") : "";

const checkToForm = (c: PcccCheck): PcccFormValues => ({
    householdId: householdIdOf(c.householdId),
    householdLabel: householdText(c.householdId),
    inspectionDate: c.inspectionDate ? new Date(c.inspectionDate) : new Date(),
    hasFireExtinguisher: c.hasFireExtinguisher,
    hasEmergencyExit: c.hasEmergencyExit,
    hasIndoorEvCharging: c.hasIndoorEvCharging,
    hasGasStoveOrStorageOrBusiness: c.hasGasStoveOrStorageOrBusiness,
    isCrowdedRental: c.isCrowdedRental,
    riskLevel: c.riskLevel,
    remediationNeeded: c.remediationNeeded || "",
    followUpStatus: c.followUpStatus || "",
});

const PcccListPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <PcccListContent />
    </AdminGuard>
);

const PcccListContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const location = useLocation();
    const user = useStore(state => state.user);
    const canManage =
        !!user &&
        (user.roles.includes("admin") ||
            user.roles.includes("neighborhood_leader") ||
            user.roles.includes("regional_police"));

    const [summary, setSummary] = useState<Record<string, number>>({});
    const [riskLevel, setRiskLevel] = useState<MucNguyCoPccc | "">(
        (new URLSearchParams(location.search).get(
            "riskLevel",
        ) as MucNguyCoPccc | null) || "",
    );
    const [items, setItems] = useState<PcccCheck[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [formVisible, setFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<PcccFormValues>(EMPTY_PCCC_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadSummary = () => {
        fetchPcccRiskSummary()
            .then(setSummary)
            .catch(() => setSummary({}));
    };

    const load = (targetPage = 1) => {
        if (targetPage === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(false);
        fetchPcccChecks({ page: targetPage, riskLevel: riskLevel || undefined })
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
        loadSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskLevel]);

    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_PCCC_FORM);
        setFormVisible(true);
    };

    const openEdit = (c: PcccCheck) => {
        setEditingId(c._id);
        setForm(checkToForm(c));
        setFormVisible(true);
    };

    const handleSubmit = async () => {
        if (!isPcccFormValid(form)) {
            openSnackbar({
                type: "error",
                text: "Vui lòng chọn hộ dân và ngày kiểm tra",
            });
            return;
        }
        try {
            setSubmitting(true);
            if (editingId) {
                await updatePcccCheck(editingId, toPcccInput(form));
                openSnackbar({
                    type: "success",
                    text: "Đã cập nhật đợt kiểm tra",
                });
            } else {
                await createPcccCheck(toPcccInput(form));
                openSnackbar({
                    type: "success",
                    text: "Đã thêm đợt kiểm tra PCCC",
                });
            }
            setFormVisible(false);
            load(1);
            loadSummary();
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
            await deletePcccCheck(confirmDeleteId);
            openSnackbar({ type: "success", text: "Đã xóa đợt kiểm tra" });
            setConfirmDeleteId(null);
            setFormVisible(false);
            load(1);
            loadSummary();
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <PageLayout
            id="admin-pccc-list"
            title="Phòng cháy chữa cháy"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Box flex style={{ gap: 8 }}>
                    <StatCard
                        label="Xanh"
                        value={summary.xanh ?? 0}
                        tone="success"
                    />
                    <StatCard
                        label="Vàng"
                        value={summary.vang ?? 0}
                        tone="warning"
                    />
                    <StatCard
                        label="Đỏ"
                        value={summary.do ?? 0}
                        tone="danger"
                    />
                </Box>

                <Box mt={3}>
                    <Select
                        label="Lọc theo mức nguy cơ"
                        closeOnSelect
                        value={riskLevel}
                        onChange={v => setRiskLevel((v as MucNguyCoPccc) || "")}
                    >
                        <Select.Option title="Tất cả mức nguy cơ" value="" />
                        {(
                            Object.entries(MUC_NGUY_CO_PCCC_LABEL) as [
                                MucNguyCoPccc,
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

                <Box className="bg-white rounded-2xl px-4 mt-3 shadow-sm">
                    {loading && <LoadingState />}
                    {!loading && error && (
                        <ErrorState onRetry={() => load(1)} />
                    )}
                    {!loading && !error && items.length === 0 && (
                        <EmptyState label="Chưa có đợt kiểm tra PCCC nào" />
                    )}
                    {!loading &&
                        !error &&
                        items.map(c => (
                            <ListRow
                                key={c._id}
                                title={householdText(c.householdId)}
                                subtitle={`Kiểm tra: ${formatDate(
                                    c.inspectionDate,
                                )}`}
                                right={
                                    <StatusBadge
                                        label={
                                            MUC_NGUY_CO_PCCC_LABEL[c.riskLevel]
                                        }
                                        tone={RISK_TONE[c.riskLevel]}
                                    />
                                }
                                onClick={
                                    canManage ? () => openEdit(c) : undefined
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
                title={
                    editingId
                        ? "Sửa đợt kiểm tra PCCC"
                        : "Thêm đợt kiểm tra PCCC"
                }
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
                        <PcccForm values={form} onChange={setForm} />
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
                            {editingId ? "Lưu thay đổi" : "Thêm đợt kiểm tra"}
                        </Button>
                        {canManage && editingId && (
                            <Button
                                variant="secondary"
                                fullWidth
                                className="!text-red-500"
                                onClick={() => setConfirmDeleteId(editingId)}
                            >
                                Xóa đợt kiểm tra
                            </Button>
                        )}
                    </Box>
                </Box>
            </Sheet>

            <Modal
                visible={!!confirmDeleteId}
                title="Xóa đợt kiểm tra?"
                description="Bạn có chắc muốn xóa đợt kiểm tra PCCC này? Hành động này không thể hoàn tác."
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

export default PcccListPage;
