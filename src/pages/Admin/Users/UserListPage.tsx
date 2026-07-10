import React, { useEffect, useState } from "react";
import { Box, Select, Sheet, Text, useSnackbar } from "zmp-ui";
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
import { Button, Input } from "@components/customized";
import {
    fetchUsers,
    updateUser,
    revokeUserSession,
    assignUserRole,
    revokeUserRole,
} from "@service/userApi";
import { Role, User, UserStatus } from "@dts";
import { ROLE_LABEL } from "@constants/domain";
import { DEFAULT_PAGE_SIZE } from "@constants/common";

const STATUS_LABEL: Record<UserStatus, string> = {
    active: "Đang hoạt động",
    pending: "Chờ duyệt",
    locked: "Đã khóa",
};

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
    active: "green",
    pending: "yellow",
    locked: "red",
};

const UserListPage: React.FC = () => (
    <AdminGuard roles={["admin"]}>
        <PageLayout
            id="admin-users"
            title="Người dùng & vai trò"
            bottomNav={<AppBottomNav />}
        >
            <UserListContent />
        </PageLayout>
    </AdminGuard>
);

const UserListContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [role, setRole] = useState<Role | "">("");
    const [items, setItems] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [sheetVisible, setSheetVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<UserStatus>("active");
    const [clustersText, setClustersText] = useState("");
    const [saving, setSaving] = useState(false);
    const [roleToAssign, setRoleToAssign] = useState<Role>("resident");
    const [assigningRole, setAssigningRole] = useState(false);
    const [revokingRole, setRevokingRole] = useState<Role | null>(null);
    const [settingPrimaryRole, setSettingPrimaryRole] = useState<Role | null>(
        null,
    );
    const [revokingSession, setRevokingSession] = useState(false);

    const load = (targetPage: number, append: boolean) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(false);
        fetchUsers(
            targetPage,
            DEFAULT_PAGE_SIZE,
            search || undefined,
            role || undefined,
        )
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
        load(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, role]);

    const handleSearchSubmit = () => setSearch(searchInput.trim());

    const openManageSheet = (user: User) => {
        setSelectedUser(user);
        setDisplayName(user.displayName || "");
        setPhone(user.phone || "");
        setStatus(user.status);
        setClustersText((user.assignedClusters || []).join(", "));
        setRoleToAssign("resident");
        setSheetVisible(true);
    };

    const refreshSelected = (updated: User) => {
        setSelectedUser(updated);
        setItems(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    };

    const handleSaveProfile = async () => {
        if (!selectedUser) return;
        try {
            setSaving(true);
            const updated = await updateUser(selectedUser.id, {
                displayName: displayName.trim(),
                phone: phone.trim() || undefined,
                status,
                assignedClusters: clustersText
                    .split(",")
                    .map(c => c.trim())
                    .filter(Boolean),
            });
            refreshSelected(updated);
            openSnackbar({ type: "success", text: "Đã cập nhật người dùng" });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAssignRole = async () => {
        if (!selectedUser) return;
        try {
            setAssigningRole(true);
            await assignUserRole(selectedUser.id, roleToAssign);
            openSnackbar({
                type: "success",
                text: `Đã gán vai trò ${ROLE_LABEL[roleToAssign]}`,
            });
            const updated = {
                ...selectedUser,
                roles: selectedUser.roles.includes(roleToAssign)
                    ? selectedUser.roles
                    : [...selectedUser.roles, roleToAssign],
            };
            refreshSelected(updated);
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setAssigningRole(false);
        }
    };

    const handleSetPrimaryRole = async (r: Role) => {
        if (!selectedUser) return;
        try {
            setSettingPrimaryRole(r);
            const updated = await updateUser(selectedUser.id, {
                primaryRole: r,
            });
            refreshSelected(updated);
            openSnackbar({
                type: "success",
                text: `Đã đặt ${ROLE_LABEL[r]} làm vai trò chính`,
            });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSettingPrimaryRole(null);
        }
    };

    const handleRevokeRole = async (r: Role) => {
        if (!selectedUser) return;
        try {
            setRevokingRole(r);
            const updated = await revokeUserRole(selectedUser.id, r);
            refreshSelected(updated);
            openSnackbar({
                type: "success",
                text: `Đã thu hồi vai trò ${ROLE_LABEL[r]}`,
            });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setRevokingRole(null);
        }
    };

    const handleRevokeSession = async () => {
        if (!selectedUser) return;
        try {
            setRevokingSession(true);
            await revokeUserSession(selectedUser.id);
            openSnackbar({
                type: "success",
                text: "Đã thu hồi phiên đăng nhập",
            });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setRevokingSession(false);
        }
    };

    return (
        <Box p={4}>
            <Box
                className="bg-white rounded-2xl p-3 shadow-sm mb-3"
                flex
                alignItems="flex-end"
                style={{ gap: 8 }}
            >
                <Box style={{ flex: 1 }}>
                    <Input
                        label="Tìm kiếm"
                        placeholder="Tên hoặc số điện thoại"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onPressEnter={handleSearchSubmit}
                    />
                </Box>
                <Button size="small" onClick={handleSearchSubmit}>
                    Tìm
                </Button>
            </Box>

            <Box flex style={{ gap: 8, overflowX: "auto" }} mb={3}>
                <Button
                    size="small"
                    variant={role === "" ? "primary" : "secondary"}
                    onClick={() => setRole("")}
                >
                    Tất cả
                </Button>
                {(Object.entries(ROLE_LABEL) as [Role, string][]).map(
                    ([key, label]) => (
                        <Button
                            key={key}
                            size="small"
                            variant={role === key ? "primary" : "secondary"}
                            onClick={() => setRole(key)}
                        >
                            {label}
                        </Button>
                    ),
                )}
            </Box>

            <Text size="xSmall" className="text-text_2 mb-2">
                {total > 0 ? `${total} người dùng` : ""}
            </Text>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState onRetry={() => load(1, false)} />}
            {!loading && !error && items.length === 0 && (
                <EmptyState label="Không tìm thấy người dùng nào" />
            )}

            {!loading && !error && items.length > 0 && (
                <>
                    <Box className="bg-white rounded-2xl px-4 shadow-sm">
                        {items.map(u => (
                            <ListRow
                                key={u.id}
                                title={`${u.displayName}${
                                    u.phone ? ` · ${u.phone}` : ""
                                }`}
                                subtitle={u.roles
                                    .map(r => ROLE_LABEL[r])
                                    .join(", ")}
                                right={
                                    <StatusBadge
                                        label={STATUS_LABEL[u.status]}
                                        tone={STATUS_TONE[u.status]}
                                    />
                                }
                                onClick={() => openManageSheet(u)}
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
                onClose={() => setSheetVisible(false)}
                autoHeight
                title="Quản lý người dùng"
            >
                {selectedUser && (
                    <Box p={4}>
                        <Input
                            label="Họ tên"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                        />
                        <Box mt={3}>
                            <Input
                                label="Số điện thoại"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </Box>
                        <Box mt={3}>
                            <Select
                                label="Trạng thái tài khoản"
                                value={status}
                                onChange={val => setStatus(val as UserStatus)}
                            >
                                {(
                                    Object.entries(STATUS_LABEL) as [
                                        UserStatus,
                                        string,
                                    ][]
                                ).map(([key, label]) => (
                                    <Select.Option
                                        key={key}
                                        value={key}
                                        title={label}
                                    />
                                ))}
                            </Select>
                        </Box>
                        <Box mt={3}>
                            <Input
                                label="Cụm dân cư phụ trách (cách nhau bởi dấu phẩy)"
                                placeholder="Cụm 1, Cụm 2"
                                value={clustersText}
                                onChange={e => setClustersText(e.target.value)}
                            />
                        </Box>
                        <Box mt={4}>
                            <Button
                                fullWidth
                                loading={saving}
                                onClick={handleSaveProfile}
                            >
                                Lưu thông tin
                            </Button>
                        </Box>

                        <Box mt={4} className="pt-3 border-t border-divider_01">
                            <Text.Title size="small" className="mb-2">
                                Vai trò hiện tại
                            </Text.Title>
                            {selectedUser.roles.length === 0 && (
                                <Text
                                    size="xSmall"
                                    className="text-text_2 mb-2"
                                >
                                    Chưa có vai trò nào
                                </Text>
                            )}
                            {selectedUser.roles.map(r => (
                                <Box
                                    key={r}
                                    flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                    py={2}
                                    className="border-b border-divider_01 last:border-0"
                                >
                                    <Text size="xSmall">
                                        {ROLE_LABEL[r]}
                                        {r === selectedUser.primaryRole && (
                                            <Text
                                                size="xxSmall"
                                                className="text-main"
                                            >
                                                {" "}
                                                (Vai trò chính)
                                            </Text>
                                        )}
                                    </Text>
                                    <Box flex style={{ gap: 6 }}>
                                        {r !== selectedUser.primaryRole && (
                                            <Button
                                                size="small"
                                                variant="secondary"
                                                loading={
                                                    settingPrimaryRole === r
                                                }
                                                onClick={() =>
                                                    handleSetPrimaryRole(r)
                                                }
                                            >
                                                Đặt làm chính
                                            </Button>
                                        )}
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            loading={revokingRole === r}
                                            onClick={() => handleRevokeRole(r)}
                                        >
                                            Thu hồi
                                        </Button>
                                    </Box>
                                </Box>
                            ))}

                            <Box
                                mt={3}
                                flex
                                alignItems="flex-end"
                                style={{ gap: 8 }}
                            >
                                <Box style={{ flex: 1 }}>
                                    <Select
                                        label="Gán vai trò mới"
                                        value={roleToAssign}
                                        onChange={val =>
                                            setRoleToAssign(val as Role)
                                        }
                                    >
                                        {(
                                            Object.entries(ROLE_LABEL) as [
                                                Role,
                                                string,
                                            ][]
                                        ).map(([key, label]) => (
                                            <Select.Option
                                                key={key}
                                                value={key}
                                                title={label}
                                            />
                                        ))}
                                    </Select>
                                </Box>
                                <Button
                                    loading={assigningRole}
                                    onClick={handleAssignRole}
                                >
                                    Gán
                                </Button>
                            </Box>
                        </Box>

                        <Box mt={4} className="pt-3 border-t border-divider_01">
                            <Button
                                fullWidth
                                variant="secondary"
                                className="!text-red-500"
                                loading={revokingSession}
                                onClick={handleRevokeSession}
                            >
                                Thu hồi phiên đăng nhập (đăng xuất bắt buộc)
                            </Button>
                        </Box>
                    </Box>
                )}
            </Sheet>
        </Box>
    );
};

export default UserListPage;
