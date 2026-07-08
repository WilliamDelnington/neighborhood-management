import React, { useEffect, useState } from "react";
import { Box, Modal, Text, useNavigate, useParams, useSnackbar } from "zmp-ui";
import { PageLayout } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatusBadge,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button } from "@components/customized";
import { useStore } from "@store";
import { AppError, Citizen, Household } from "@dts";
import { LOAI_SO_HUU_LABEL } from "@constants/domain";
import {
    deleteHousehold,
    fetchHouseholdById,
    fetchHouseholdCitizens,
    updateHousehold,
} from "@service/householdApi";
import HouseholdForm, {
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

const toFormValues = (h: Household): HouseholdFormValues => ({
    cluster: h.cluster,
    address: h.address,
    headOfHousehold: h.headOfHousehold,
    phone: h.phone || "",
    memberCount: h.memberCount ? String(h.memberCount) : "",
    ownershipType: h.ownershipType,
    needsSupport: h.needsSupport,
    note: h.note || "",
});

const HouseholdDetailPage: React.FC = () => (
    <AdminGuard roles={[...VIEW_ROLES]}>
        <HouseholdDetailContent />
    </AdminGuard>
);

const HouseholdDetailContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const user = useStore(state => state.user);
    const canManage =
        !!user &&
        (user.roles.includes("admin") ||
            user.roles.includes("neighborhood_leader"));

    const [household, setHousehold] = useState<Household | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [citizens, setCitizens] = useState<Citizen[]>([]);
    const [citizensLoading, setCitizensLoading] = useState(true);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<HouseholdFormValues | null>(null);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setError(false);
        fetchHouseholdById(id)
            .then(h => {
                setHousehold(h);
                setForm(toFormValues(h));
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    const loadCitizens = () => {
        if (!id) return;
        setCitizensLoading(true);
        fetchHouseholdCitizens(id)
            .then(setCitizens)
            .catch(() => setCitizens([]))
            .finally(() => setCitizensLoading(false));
    };

    useEffect(() => {
        load();
        loadCitizens();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSave = async () => {
        if (!id || !form) return;
        if (!isHouseholdFormValid(form)) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập đầy đủ cụm dân cư, địa chỉ, chủ hộ",
            });
            return;
        }
        try {
            setSaving(true);
            const updated = await updateHousehold(id, toHouseholdInput(form));
            setHousehold(updated);
            setForm(toFormValues(updated));
            setEditing(false);
            openSnackbar({ type: "success", text: "Đã cập nhật hộ dân" });
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            setDeleting(true);
            await deleteHousehold(id);
            openSnackbar({ type: "success", text: "Đã xóa hộ dân" });
            navigate("/admin/households", { animate: true });
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <PageLayout id="admin-household-detail" title="Chi tiết hộ dân">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && error && <ErrorState onRetry={load} />}

                {!loading && !error && household && form && (
                    <>
                        <Box className="bg-white rounded-2xl p-4 shadow-sm">
                            <Box
                                flex
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Text.Title size="small">
                                    {household.code}
                                </Text.Title>
                                {household.needsSupport && (
                                    <StatusBadge
                                        label="Cần hỗ trợ"
                                        tone="yellow"
                                    />
                                )}
                            </Box>

                            {editing ? (
                                <>
                                    <HouseholdForm
                                        values={form}
                                        onChange={setForm}
                                    />
                                    <Box mt={4} flex style={{ gap: 8 }}>
                                        <Button
                                            variant="secondary"
                                            fullWidth
                                            onClick={() => {
                                                setForm(
                                                    toFormValues(household),
                                                );
                                                setEditing(false);
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            fullWidth
                                            loading={saving}
                                            onClick={handleSave}
                                        >
                                            Lưu
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <InfoRow
                                        label="Cụm dân cư"
                                        value={household.cluster}
                                    />
                                    <InfoRow
                                        label="Địa chỉ"
                                        value={household.address}
                                    />
                                    <InfoRow
                                        label="Chủ hộ"
                                        value={household.headOfHousehold}
                                    />
                                    <InfoRow
                                        label="Số điện thoại"
                                        value={
                                            household.phone || "Chưa cập nhật"
                                        }
                                    />
                                    <InfoRow
                                        label="Số nhân khẩu"
                                        value={String(
                                            household.memberCount ?? 0,
                                        )}
                                    />
                                    <InfoRow
                                        label="Hình thức sở hữu"
                                        value={
                                            LOAI_SO_HUU_LABEL[
                                                household.ownershipType
                                            ]
                                        }
                                    />
                                    <InfoRow
                                        label="Ghi chú"
                                        value={household.note || "Không có"}
                                    />

                                    {canManage && (
                                        <Box mt={4} flex style={{ gap: 8 }}>
                                            <Button
                                                variant="secondary"
                                                fullWidth
                                                onClick={() => setEditing(true)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                fullWidth
                                                className="!bg-red-500"
                                                onClick={() =>
                                                    setConfirmDelete(true)
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>

                        <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                            <Text.Title size="small" className="mb-2">
                                Nhân khẩu trong hộ
                            </Text.Title>
                            {citizensLoading && <LoadingState />}
                            {!citizensLoading && citizens.length === 0 && (
                                <EmptyState label="Chưa có nhân khẩu nào trong hộ" />
                            )}
                            {!citizensLoading &&
                                citizens.map(c => (
                                    <ListRow
                                        key={c._id}
                                        title={c.fullName}
                                        subtitle={
                                            c.cccd ||
                                            c.phone ||
                                            c.relationToHead
                                        }
                                        onClick={() =>
                                            navigate("/admin/citizens", {
                                                animate: true,
                                            })
                                        }
                                    />
                                ))}
                        </Box>
                    </>
                )}
            </Box>

            <Modal
                visible={confirmDelete}
                title="Xóa hộ dân?"
                description={`Bạn có chắc muốn xóa hộ ${
                    household?.code || ""
                }? Hành động này không thể hoàn tác.`}
                onClose={() => setConfirmDelete(false)}
                actions={[
                    {
                        text: "Hủy",
                        close: true,
                        onClick: () => setConfirmDelete(false),
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

const InfoRow: React.FC<{ label: string; value: string }> = ({
    label,
    value,
}) => (
    <Box
        flex
        justifyContent="space-between"
        py={2}
        className="border-b border-divider_01 last:border-0"
    >
        <Text size="xSmall" className="text-text_2">
            {label}
        </Text>
        <Text size="xSmall" className="text-right">
            {value}
        </Text>
    </Box>
);

export default HouseholdDetailPage;
