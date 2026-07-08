import React, { useEffect, useState } from "react";
import { Box, Text, useSnackbar } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button, Input, TextArea } from "@components/customized";
import { fetchAllSettings, upsertSetting } from "@service/settingsApi";

type EditableSetting = {
    key: string;
    isComplex: boolean;
    text: string;
    originalType: "string" | "number" | "boolean" | "object";
};

const buildEditable = (key: string, value: unknown): EditableSetting => {
    if (value !== null && typeof value === "object") {
        return {
            key,
            isComplex: true,
            text: JSON.stringify(value, null, 2),
            originalType: "object",
        };
    }
    if (typeof value === "number") {
        return {
            key,
            isComplex: false,
            text: String(value),
            originalType: "number",
        };
    }
    if (typeof value === "boolean") {
        return {
            key,
            isComplex: false,
            text: String(value),
            originalType: "boolean",
        };
    }
    return {
        key,
        isComplex: false,
        text: value === undefined || value === null ? "" : String(value),
        originalType: "string",
    };
};

const coerceValue = (setting: EditableSetting): unknown => {
    if (setting.isComplex) return JSON.parse(setting.text);
    if (setting.originalType === "number") return Number(setting.text);
    if (setting.originalType === "boolean") return setting.text === "true";
    return setting.text;
};

const SEED_KEY_EXAMPLES = ["app_identity", "oa_info", "emergency_contacts"];

const SettingsPage: React.FC = () => (
    <AdminGuard roles={["admin"]}>
        <PageLayout
            id="admin-settings"
            title="Cài đặt"
            bottomNav={<AppBottomNav />}
        >
            <SettingsContent />
        </PageLayout>
    </AdminGuard>
);

const SettingsContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const [settings, setSettings] = useState<Record<string, EditableSetting>>(
        {},
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [savingKey, setSavingKey] = useState<string | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [addingNew, setAddingNew] = useState(false);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchAllSettings()
            .then(data => {
                const mapped: Record<string, EditableSetting> = {};
                Object.entries(data || {}).forEach(([key, value]) => {
                    mapped[key] = buildEditable(key, value);
                });
                setSettings(mapped);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleTextChange = (key: string, text: string) => {
        setSettings(prev => ({ ...prev, [key]: { ...prev[key], text } }));
    };

    const handleSave = async (key: string) => {
        const setting = settings[key];
        if (!setting) return;
        let value: unknown;
        try {
            value = coerceValue(setting);
        } catch {
            openSnackbar({ type: "error", text: "Giá trị JSON không hợp lệ" });
            return;
        }
        try {
            setSavingKey(key);
            await upsertSetting(key, value);
            openSnackbar({ type: "success", text: "Đã lưu cấu hình" });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSavingKey(null);
        }
    };

    const handleAddNew = async () => {
        if (!newKey.trim()) {
            openSnackbar({
                type: "error",
                text: "Vui lòng nhập khóa cấu hình (key)",
            });
            return;
        }
        let value: unknown = newValue;
        try {
            value = JSON.parse(newValue);
        } catch {
            // Khong phai JSON hop le -> giu nguyen dang chuoi text
            value = newValue;
        }
        try {
            setAddingNew(true);
            await upsertSetting(
                newKey.trim(),
                value,
                newDescription.trim() || undefined,
            );
            openSnackbar({ type: "success", text: "Đã thêm cấu hình mới" });
            setShowAddForm(false);
            setNewKey("");
            setNewValue("");
            setNewDescription("");
            load();
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setAddingNew(false);
        }
    };

    const entries = Object.values(settings);

    return (
        <Box p={4}>
            {loading && <LoadingState />}
            {!loading && error && <ErrorState onRetry={load} />}

            {!loading && !error && (
                <>
                    {entries.length === 0 && !showAddForm && (
                        <EmptyState
                            label={`Chưa có cấu hình nào. Có thể thêm các khóa gợi ý như: ${SEED_KEY_EXAMPLES.join(
                                ", ",
                            )}`}
                        />
                    )}

                    {entries.map(setting => (
                        <Box
                            key={setting.key}
                            className="bg-white rounded-2xl p-4 shadow-sm mb-3"
                        >
                            <Text.Title size="small" className="mb-2">
                                {setting.key}
                            </Text.Title>
                            {setting.isComplex ? (
                                <TextArea
                                    rows={5}
                                    value={setting.text}
                                    onChange={e =>
                                        handleTextChange(
                                            setting.key,
                                            e.target.value,
                                        )
                                    }
                                />
                            ) : (
                                <Input
                                    value={setting.text}
                                    onChange={e =>
                                        handleTextChange(
                                            setting.key,
                                            e.target.value,
                                        )
                                    }
                                />
                            )}
                            <Box mt={2}>
                                <Button
                                    size="small"
                                    loading={savingKey === setting.key}
                                    onClick={() => handleSave(setting.key)}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    ))}

                    {showAddForm ? (
                        <Box className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                            <Text.Title size="small" className="mb-2">
                                Thêm cấu hình mới
                            </Text.Title>
                            <Input
                                label="Khóa (key)"
                                placeholder={`Ví dụ: ${SEED_KEY_EXAMPLES[0]}`}
                                value={newKey}
                                onChange={e => setNewKey(e.target.value)}
                            />
                            <Box mt={3}>
                                <TextArea
                                    label="Giá trị (chuỗi hoặc JSON)"
                                    rows={4}
                                    value={newValue}
                                    onChange={e => setNewValue(e.target.value)}
                                />
                            </Box>
                            <Box mt={3}>
                                <Input
                                    label="Mô tả (nếu có)"
                                    value={newDescription}
                                    onChange={e =>
                                        setNewDescription(e.target.value)
                                    }
                                />
                            </Box>
                            <Box mt={4} flex style={{ gap: 8 }}>
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    fullWidth
                                    loading={addingNew}
                                    onClick={handleAddNew}
                                >
                                    Thêm
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setShowAddForm(true)}
                        >
                            + Thêm cấu hình
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default SettingsPage;
