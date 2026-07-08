import React, { useEffect, useState } from "react";
import {
    Box,
    Icon,
    Modal,
    Radio as ZmpRadio,
    Sheet,
    Text,
    useSnackbar,
} from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    ListRow,
    StatusBadge,
    BadgeTone,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button, Input, TextArea, Radio } from "@components/customized";
import {
    fetchFinanceTransactions,
    createFinanceTransaction,
    updateFinanceTransaction,
    cancelFinanceTransaction,
    deleteFinanceTransaction,
    fetchFinanceSummary,
    FinanceTransaction,
    FinanceTransactionInput,
} from "@service/financeApi";
import { DEFAULT_PAGE_SIZE } from "@constants/common";

const FINANCE_TYPE_LABEL: Record<FinanceTransaction["type"], string> = {
    thu: "Khoản thu",
    chi: "Khoản chi",
};

const FINANCE_STATUS_LABEL: Record<FinanceTransaction["status"], string> = {
    nhap: "Nháp",
    da_duyet: "Đã duyệt",
    da_huy: "Đã hủy",
};

const FINANCE_STATUS_TONE: Record<FinanceTransaction["status"], BadgeTone> = {
    nhap: "gray",
    da_duyet: "green",
    da_huy: "red",
};

const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount || 0);

const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("vi-VN");
};

const humanizeKey = (key: string) =>
    key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^./, c => c.toUpperCase());

const TYPE_FILTERS: { key: "" | FinanceTransaction["type"]; label: string }[] =
    [
        { key: "", label: "Tất cả" },
        { key: "thu", label: "Khoản thu" },
        { key: "chi", label: "Khoản chi" },
    ];

const STATUS_FILTERS: {
    key: "" | FinanceTransaction["status"];
    label: string;
}[] = [
    { key: "", label: "Mọi trạng thái" },
    { key: "nhap", label: "Nháp" },
    { key: "da_duyet", label: "Đã duyệt" },
    { key: "da_huy", label: "Đã hủy" },
];

type EditableTransaction = {
    type: FinanceTransaction["type"];
    partyName: string;
    amount: string;
    transactionDate: string;
    content: string;
};

const emptyForm: EditableTransaction = {
    type: "thu",
    partyName: "",
    amount: "",
    transactionDate: new Date().toISOString().slice(0, 10),
    content: "",
};

const FinanceListPage: React.FC = () => (
    <AdminGuard roles={["admin"]}>
        <PageLayout
            id="admin-finance"
            title="Tài chính tổ dân phố"
            bottomNav={<AppBottomNav />}
        >
            <FinanceListContent />
        </PageLayout>
    </AdminGuard>
);

const FinanceListContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const [summary, setSummary] = useState<Record<string, unknown> | null>(
        null,
    );
    const [summaryLoading, setSummaryLoading] = useState(true);

    const [type, setType] = useState<"" | FinanceTransaction["type"]>("");
    const [status, setStatus] = useState<"" | FinanceTransaction["status"]>("");
    const [items, setItems] = useState<FinanceTransaction[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [sheetVisible, setSheetVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<EditableTransaction>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const [confirm, setConfirm] = useState<{
        title: string;
        description: string;
        onConfirm: () => void;
    } | null>(null);

    const loadSummary = () => {
        setSummaryLoading(true);
        fetchFinanceSummary()
            .then(res => setSummary((res as Record<string, unknown>) || null))
            .catch(() => setSummary(null))
            .finally(() => setSummaryLoading(false));
    };

    const load = (targetPage: number, append: boolean) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(false);
        fetchFinanceTransactions({
            page: targetPage,
            limit: DEFAULT_PAGE_SIZE,
            type: type || undefined,
            status: status || undefined,
        })
            .then(res => {
                setItems(prev =>
                    append ? [...prev, ...res.items] : res.items,
                );
                setPage(res.page);
                setTotalPages(res.totalPages);
                setTotal(res.total);
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
        load(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, status]);

    const openCreateSheet = () => {
        setEditingId(null);
        setForm(emptyForm);
        setSheetVisible(true);
    };

    const openEditSheet = (t: FinanceTransaction) => {
        setEditingId(t._id);
        setForm({
            type: t.type,
            partyName: t.partyName,
            amount: String(t.amount),
            transactionDate: (t.transactionDate || "").slice(0, 10),
            content: t.content,
        });
        setSheetVisible(true);
    };

    const closeSheet = () => setSheetVisible(false);

    const handleSave = async () => {
        const amountNumber = Number(form.amount);
        if (
            !form.partyName.trim() ||
            !form.content.trim() ||
            !form.transactionDate
        ) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập đầy đủ thông tin",
            });
            return;
        }
        if (!amountNumber || amountNumber <= 0) {
            openSnackbar({ type: "error", text: "Số tiền không hợp lệ" });
            return;
        }
        const input: FinanceTransactionInput = {
            type: form.type,
            partyName: form.partyName.trim(),
            amount: amountNumber,
            transactionDate: new Date(form.transactionDate).toISOString(),
            content: form.content.trim(),
        };
        try {
            setSaving(true);
            if (editingId) {
                await updateFinanceTransaction(editingId, input);
                openSnackbar({
                    type: "success",
                    text: "Đã cập nhật giao dịch",
                });
            } else {
                await createFinanceTransaction(input);
                openSnackbar({
                    type: "success",
                    text: "Đã ghi nhận giao dịch",
                });
            }
            setSheetVisible(false);
            load(1, false);
            loadSummary();
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelTransaction = () => {
        if (!editingId) return;
        setConfirm({
            title: "Hủy giao dịch",
            description:
                "Giao dịch sẽ được đánh dấu là đã hủy. Bạn có chắc chắn muốn tiếp tục?",
            onConfirm: async () => {
                try {
                    setCancelling(true);
                    await cancelFinanceTransaction(editingId);
                    openSnackbar({ type: "success", text: "Đã hủy giao dịch" });
                    setSheetVisible(false);
                    load(1, false);
                    loadSummary();
                } catch (err: any) {
                    openSnackbar({
                        type: "error",
                        text: err?.message || "Có lỗi xảy ra",
                    });
                } finally {
                    setCancelling(false);
                    setConfirm(null);
                }
            },
        });
    };

    const handleDeleteTransaction = () => {
        if (!editingId) return;
        setConfirm({
            title: "Xóa giao dịch",
            description:
                "Thao tác này sẽ xóa vĩnh viễn giao dịch khỏi hệ thống và không thể khôi phục. Bạn có chắc chắn?",
            onConfirm: async () => {
                try {
                    setSaving(true);
                    await deleteFinanceTransaction(editingId);
                    openSnackbar({ type: "success", text: "Đã xóa giao dịch" });
                    setSheetVisible(false);
                    load(1, false);
                    loadSummary();
                } catch (err: any) {
                    openSnackbar({
                        type: "error",
                        text: err?.message || "Có lỗi xảy ra",
                    });
                } finally {
                    setSaving(false);
                    setConfirm(null);
                }
            },
        });
    };

    return (
        <Box p={4}>
            <Box className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                <Text.Title size="small" className="mb-2">
                    Tổng quan thu chi
                </Text.Title>
                {summaryLoading && (
                    <LoadingState label="Đang tải tổng hợp..." />
                )}
                {!summaryLoading && !summary && (
                    <Text size="xSmall" className="text-text_2">
                        Chưa có dữ liệu tổng hợp
                    </Text>
                )}
                {!summaryLoading && summary && (
                    <Box flex flexWrap style={{ gap: 8 }}>
                        {Object.entries(summary).map(([key, value]) => (
                            <Box
                                key={key}
                                className="bg-ng_10 rounded-xl p-3"
                                style={{ width: "calc(50% - 4px)" }}
                            >
                                <Text size="xxSmall" className="text-text_2">
                                    {humanizeKey(key)}
                                </Text>
                                <Text.Title size="small" className="mt-1">
                                    {typeof value === "number"
                                        ? formatVnd(value)
                                        : String(value)}
                                </Text.Title>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Box flex alignItems="center" justifyContent="space-between" mb={3}>
                <Text.Title size="small">
                    Giao dịch {total > 0 ? `(${total})` : ""}
                </Text.Title>
                <Button
                    size="small"
                    prefixIcon={<Icon icon="zi-plus" />}
                    onClick={openCreateSheet}
                >
                    Thêm mới
                </Button>
            </Box>

            <Box flex style={{ gap: 8, overflowX: "auto" }} mb={2}>
                {TYPE_FILTERS.map(f => (
                    <Button
                        key={f.key || "all-type"}
                        size="small"
                        variant={type === f.key ? "primary" : "secondary"}
                        onClick={() => setType(f.key)}
                    >
                        {f.label}
                    </Button>
                ))}
            </Box>
            <Box flex style={{ gap: 8, overflowX: "auto" }} mb={3}>
                {STATUS_FILTERS.map(f => (
                    <Button
                        key={f.key || "all-status"}
                        size="small"
                        variant={status === f.key ? "primary" : "secondary"}
                        onClick={() => setStatus(f.key)}
                    >
                        {f.label}
                    </Button>
                ))}
            </Box>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState onRetry={() => load(1, false)} />}
            {!loading && !error && items.length === 0 && (
                <EmptyState label="Chưa có giao dịch nào" />
            )}

            {!loading && !error && items.length > 0 && (
                <>
                    <Box className="bg-white rounded-2xl px-4 shadow-sm">
                        {items.map(t => (
                            <ListRow
                                key={t._id}
                                title={`${t.partyName} — ${t.content}`}
                                subtitle={formatDate(t.transactionDate)}
                                right={
                                    <Box
                                        flex
                                        flexDirection="column"
                                        alignItems="flex-end"
                                        style={{ gap: 4 }}
                                    >
                                        <Text
                                            size="small"
                                            className={`font-medium ${
                                                t.type === "thu"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {t.type === "thu" ? "+" : "-"}
                                            {formatVnd(t.amount)}
                                        </Text>
                                        <StatusBadge
                                            label={
                                                FINANCE_STATUS_LABEL[t.status]
                                            }
                                            tone={FINANCE_STATUS_TONE[t.status]}
                                        />
                                    </Box>
                                }
                                onClick={() => openEditSheet(t)}
                            />
                        ))}
                    </Box>

                    {page < totalPages && (
                        <Box mt={3}>
                            <Button
                                fullWidth
                                variant="secondary"
                                loading={loadingMore}
                                onClick={() => load(page + 1, true)}
                            >
                                Tải thêm
                            </Button>
                        </Box>
                    )}
                </>
            )}

            <Sheet
                visible={sheetVisible}
                onClose={closeSheet}
                autoHeight
                title={editingId ? "Chi tiết giao dịch" : "Thêm giao dịch"}
            >
                <Box p={4}>
                    <ZmpRadio.Group
                        value={form.type}
                        onChange={val =>
                            setForm(prev => ({
                                ...prev,
                                type: val as FinanceTransaction["type"],
                            }))
                        }
                    >
                        <Box flex style={{ gap: 16 }}>
                            <Radio value="thu" label={FINANCE_TYPE_LABEL.thu} />
                            <Radio value="chi" label={FINANCE_TYPE_LABEL.chi} />
                        </Box>
                    </ZmpRadio.Group>

                    <Box mt={3}>
                        <Input
                            label="Người nộp / người nhận"
                            placeholder="Họ tên hoặc đơn vị"
                            value={form.partyName}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    partyName: e.target.value,
                                }))
                            }
                        />
                    </Box>

                    <Box mt={3}>
                        <Input
                            label="Số tiền (VND)"
                            type="number"
                            placeholder="0"
                            value={form.amount}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    amount: e.target.value,
                                }))
                            }
                        />
                    </Box>

                    <Box mt={3}>
                        <Text
                            size="small"
                            className="font-medium text-text_1 mb-1"
                        >
                            Ngày thu / chi
                        </Text>
                        <input
                            type="date"
                            className="w-full bg-ng_10 rounded-xl px-3 py-2 text-sm border-none outline-none"
                            value={form.transactionDate}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    transactionDate: e.target.value,
                                }))
                            }
                        />
                    </Box>

                    <Box mt={3}>
                        <TextArea
                            label="Nội dung"
                            placeholder="Nội dung khoản thu/chi"
                            rows={3}
                            value={form.content}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                        />
                    </Box>

                    <Box mt={4} flex flexDirection="column" style={{ gap: 8 }}>
                        <Button fullWidth loading={saving} onClick={handleSave}>
                            Lưu giao dịch
                        </Button>
                        {editingId && (
                            <>
                                <Button
                                    fullWidth
                                    variant="secondary"
                                    loading={cancelling}
                                    onClick={handleCancelTransaction}
                                >
                                    Hủy giao dịch
                                </Button>
                                <Button
                                    fullWidth
                                    variant="secondary"
                                    className="!text-red-500"
                                    onClick={handleDeleteTransaction}
                                >
                                    Xóa vĩnh viễn (Admin)
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Sheet>

            <Modal
                visible={!!confirm}
                title={confirm?.title}
                description={confirm?.description}
                onClose={() => setConfirm(null)}
                actions={[
                    { text: "Đóng", close: true },
                    {
                        text: "Xác nhận",
                        danger: true,
                        onClick: () => confirm?.onConfirm(),
                    },
                ]}
            />
        </Box>
    );
};

export default FinanceListPage;
