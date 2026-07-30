import React, { useEffect, useState } from "react";
import {
    Box,
    Modal,
    Sheet,
    Text,
    useNavigate,
    useParams,
    useSnackbar,
} from "zmp-ui";
import { PageLayout } from "@components/layout";
import {
    EmptyState,
    ErrorState,
    ListRow,
    LoadingState,
    StatusBadge,
} from "@components/admin";
import { Button } from "@components/customized";
import { RequireAuth, hasPermission } from "@components/role";
import {
    HouseForm,
    HouseFormValues,
    isHouseFormValid,
    toHouseInput,
} from "@components/house";
import {
    BusinessForm,
    EMPTY_BUSINESS_FORM,
    BusinessFormValues,
    isBusinessFormValid,
    toBusinessInput,
} from "@components/business";
import { AttachmentUploader } from "@components/attachments";
import { useStore } from "@store";
import {
    BUSINESS_STATUS_LABEL,
    BUSINESS_STATUS_TONE,
    HOUSE_STATUS_LABEL,
    HOUSE_STATUS_TONE,
} from "@constants/domain";
import { AppError, Business, House, HouseStatus, Household } from "@dts";
import {
    deleteHouse,
    fetchHouseAttachments,
    fetchHouseBusinesses,
    fetchHouseById,
    fetchHouseHouseholds,
    deleteHouseAttachment,
    updateHouse,
    updateHouseStatus,
} from "@service/houseApi";
import { createBusiness } from "@service/businessApi";

const toFormValues = (h: House): HouseFormValues => ({
    cluster: h.cluster,
    address: h.address,
    note: h.note || "",
});

const ownerIdOf = (house: House): string | undefined =>
    typeof house.ownerId === "string" ? house.ownerId : house.ownerId?._id;

const HouseDetailPage: React.FC = () => (
    <RequireAuth>
        <HouseDetailContent />
    </RequireAuth>
);

const HouseDetailContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const user = useStore(state => state.user);

    const isAdmin = !!user?.roles.includes("admin");
    const canUpdate = hasPermission(user, "houses.update");
    const canVerify = hasPermission(user, "houses.verify");
    const canDelete = hasPermission(user, "houses.delete");
    const canViewHouseholds = hasPermission(user, "households.read");
    const canViewBusinesses = hasPermission(user, "businesses.read");
    const canCreateBusiness = hasPermission(user, "businesses.create");

    const [house, setHouse] = useState<House | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<HouseFormValues | null>(null);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [statusSubmitting, setStatusSubmitting] = useState(false);

    const [households, setHouseholds] = useState<Household[]>([]);
    const [householdsLoading, setHouseholdsLoading] = useState(true);

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [businessesLoading, setBusinessesLoading] = useState(true);
    const [businessSheetVisible, setBusinessSheetVisible] = useState(false);
    const [businessForm, setBusinessForm] =
        useState<BusinessFormValues>(EMPTY_BUSINESS_FORM);
    const [businessSubmitting, setBusinessSubmitting] = useState(false);

    const load = () => {
        if (!id) return;
        setLoading(true);
        setError(false);
        fetchHouseById(id)
            .then(h => {
                setHouse(h);
                setForm(toFormValues(h));
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    const loadHouseholds = () => {
        if (!id || !canViewHouseholds) {
            setHouseholdsLoading(false);
            return;
        }
        setHouseholdsLoading(true);
        fetchHouseHouseholds(id)
            .then(res => setHouseholds(res.items))
            .catch(() => setHouseholds([]))
            .finally(() => setHouseholdsLoading(false));
    };

    const loadBusinesses = () => {
        if (!id || !canViewBusinesses) {
            setBusinessesLoading(false);
            return;
        }
        setBusinessesLoading(true);
        fetchHouseBusinesses(id)
            .then(res => setBusinesses(res.items))
            .catch(() => setBusinesses([]))
            .finally(() => setBusinessesLoading(false));
    };

    useEffect(() => {
        load();
        loadHouseholds();
        loadBusinesses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!id) return null;

    const isOwner = !!user && !!house && ownerIdOf(house) === user.id;

    const handleSave = async () => {
        if (!form) return;
        if (!isHouseFormValid(form)) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập đầy đủ cụm dân cư và địa chỉ",
            });
            return;
        }
        try {
            setSaving(true);
            const updated = await updateHouse(id, toHouseInput(form));
            setHouse(updated);
            setForm(toFormValues(updated));
            setEditing(false);
            openSnackbar({ type: "success", text: "Đã cập nhật nhà số" });
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (target: HouseStatus) => {
        try {
            setStatusSubmitting(true);
            const updated = await updateHouseStatus(id, target);
            setHouse(updated);
            setForm(toFormValues(updated));
            openSnackbar({ type: "success", text: "Đã cập nhật trạng thái" });
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setStatusSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteHouse(id);
            openSnackbar({ type: "success", text: "Đã xóa nhà số" });
            navigate("/admin/houses", { animate: true });
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    const openCreateBusiness = () => {
        setBusinessForm(EMPTY_BUSINESS_FORM);
        setBusinessSheetVisible(true);
    };

    // Sua/xoa mot ho kinh doanh da co gio chuyen sang man chi tiet rieng
    // (/admin/businesses/:id, xem BusinessDetailPage) - can du cho de hien
    // trang thai xac thuc + tai lieu dinh kem, khong con hop ly trong mot
    // Sheet nho. Sheet o day chi con dung de tao moi (houseId co san tu ngu
    // canh trang nay).
    const handleSaveBusiness = async () => {
        if (!isBusinessFormValid(businessForm)) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập tên hộ kinh doanh",
            });
            return;
        }
        try {
            setBusinessSubmitting(true);
            await createBusiness(toBusinessInput(businessForm, id));
            openSnackbar({ type: "success", text: "Đã thêm hộ kinh doanh" });
            setBusinessSheetVisible(false);
            loadBusinesses();
        } catch (err) {
            openSnackbar({ type: "error", text: (err as AppError).message });
        } finally {
            setBusinessSubmitting(false);
        }
    };

    const statusActions: {
        label: string;
        target: HouseStatus;
        danger?: boolean;
    }[] = [];
    if (house) {
        if (isAdmin) {
            (Object.keys(HOUSE_STATUS_LABEL) as HouseStatus[])
                .filter(s => s !== house.status)
                .forEach(s =>
                    statusActions.push({
                        label: HOUSE_STATUS_LABEL[s],
                        target: s,
                        danger: s === "denied" || s === "locked",
                    }),
                );
        } else if (house.status !== "locked") {
            if (
                isOwner &&
                (house.status === "unverified" || house.status === "denied")
            ) {
                statusActions.push({ label: "Gửi duyệt", target: "pending" });
            }
            if (!isOwner && canVerify && house.status === "pending") {
                statusActions.push({ label: "Duyệt", target: "verified" });
                statusActions.push({
                    label: "Từ chối",
                    target: "denied",
                    danger: true,
                });
            }
        }
    }

    const canEditNow = canUpdate && (isAdmin || house?.status !== "locked");

    return (
        <PageLayout id="admin-house-detail" title="Chi tiết nhà số">
            <Box p={4}>
                {loading && <LoadingState />}
                {!loading && error && <ErrorState onRetry={load} />}

                {!loading && !error && house && form && (
                    <>
                        <Box className="bg-white rounded-2xl p-4 shadow-sm">
                            <Box
                                flex
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Text.Title size="small">
                                    {house.code}
                                </Text.Title>
                                <StatusBadge
                                    label={HOUSE_STATUS_LABEL[house.status]}
                                    tone={HOUSE_STATUS_TONE[house.status]}
                                />
                            </Box>

                            {editing ? (
                                <>
                                    <HouseForm
                                        values={form}
                                        onChange={setForm}
                                    />
                                    <Box mt={4} flex style={{ gap: 8 }}>
                                        <Button
                                            variant="secondary"
                                            fullWidth
                                            onClick={() => {
                                                setForm(toFormValues(house));
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
                                        value={house.cluster}
                                    />
                                    <InfoRow
                                        label="Địa chỉ"
                                        value={house.address}
                                    />
                                    <InfoRow
                                        label="Ghi chú"
                                        value={house.note || "Không có"}
                                    />

                                    {statusActions.length > 0 && (
                                        <Box
                                            mt={3}
                                            flex
                                            style={{ gap: 8, flexWrap: "wrap" }}
                                        >
                                            {statusActions.map(action => (
                                                <Button
                                                    key={action.target}
                                                    className={
                                                        action.danger
                                                            ? "!bg-red-500"
                                                            : undefined
                                                    }
                                                    loading={statusSubmitting}
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            action.target,
                                                        )
                                                    }
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </Box>
                                    )}

                                    {(canEditNow || canDelete) && (
                                        <Box mt={4} flex style={{ gap: 8 }}>
                                            {canEditNow && (
                                                <Button
                                                    variant="secondary"
                                                    fullWidth
                                                    onClick={() =>
                                                        setEditing(true)
                                                    }
                                                >
                                                    Chỉnh sửa
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    fullWidth
                                                    className="!bg-red-500"
                                                    onClick={() =>
                                                        setConfirmDelete(true)
                                                    }
                                                >
                                                    Xóa
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>

                        <AttachmentUploader
                            relatedModel="HouseRecord"
                            relatedId={id}
                            canUpload={isOwner || canUpdate || canVerify}
                            canDelete={canUpdate || canVerify}
                            fetchAttachments={fetchHouseAttachments}
                            deleteAttachmentFn={deleteHouseAttachment}
                        />

                        {canViewHouseholds && (
                            <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                                <Text.Title size="small" className="mb-2">
                                    Hộ dân trong nhà
                                </Text.Title>
                                {householdsLoading && <LoadingState />}
                                {!householdsLoading &&
                                    households.length === 0 && (
                                        <EmptyState label="Chưa có hộ dân nào trong nhà này" />
                                    )}
                                {!householdsLoading &&
                                    households.map(h => (
                                        <ListRow
                                            key={h._id}
                                            title={`${h.code} — ${h.headOfHousehold}`}
                                            subtitle={h.address}
                                            onClick={() =>
                                                navigate(
                                                    `/admin/households/${h._id}`,
                                                    { animate: true },
                                                )
                                            }
                                        />
                                    ))}
                            </Box>
                        )}

                        {canViewBusinesses && (
                            <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                                <Box
                                    flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={2}
                                >
                                    <Text.Title size="small">
                                        Hộ kinh doanh
                                    </Text.Title>
                                    {canCreateBusiness && (
                                        <Text
                                            size="xSmall"
                                            className="text-main"
                                            onClick={openCreateBusiness}
                                        >
                                            + Thêm
                                        </Text>
                                    )}
                                </Box>
                                {businessesLoading && <LoadingState />}
                                {!businessesLoading &&
                                    businesses.length === 0 && (
                                        <EmptyState label="Chưa có hộ kinh doanh nào trong nhà này" />
                                    )}
                                {!businessesLoading &&
                                    businesses.map(b => (
                                        <ListRow
                                            key={b._id}
                                            title={b.name}
                                            subtitle={b.ownerName || b.phone}
                                            right={
                                                <StatusBadge
                                                    label={
                                                        BUSINESS_STATUS_LABEL[
                                                            b.status
                                                        ]
                                                    }
                                                    tone={
                                                        BUSINESS_STATUS_TONE[
                                                            b.status
                                                        ]
                                                    }
                                                />
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/admin/businesses/${b._id}`,
                                                    { animate: true },
                                                )
                                            }
                                        />
                                    ))}
                            </Box>
                        )}
                    </>
                )}
            </Box>

            <Modal
                visible={confirmDelete}
                title="Xóa nhà số?"
                description={`Bạn có chắc muốn xóa nhà ${
                    house?.code || ""
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

            <Sheet
                visible={businessSheetVisible}
                onClose={() => setBusinessSheetVisible(false)}
                title="Thêm hộ kinh doanh"
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
                        <BusinessForm
                            values={businessForm}
                            onChange={setBusinessForm}
                        />
                    </Box>
                    <Box mt={3} flex style={{ gap: 8 }}>
                        <Button
                            fullWidth
                            loading={businessSubmitting}
                            onClick={handleSaveBusiness}
                        >
                            Lưu
                        </Button>
                    </Box>
                </Box>
            </Sheet>
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

export default HouseDetailPage;
