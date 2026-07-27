import type { User } from "@dts";

export { default as RequireAuth } from "./RequireAuth";

/**
 * Quyen toi thieu de vao duoc trang quan tri web (xem AdminGuard permissions={["dashboard.read"]}
 * trong quan-ly-to-dan-pho-hoa-binh-admin/src/App.tsx). Dung chung mot khoa quyen thay vi danh
 * sach vai tro cung, de viec cap/thu quyen tu man hinh Vai tro & phan quyen cua admin phan anh
 * dung vao Mini App ma khong can sua code o day.
 */
const ADMIN_ACCESS_PERMISSION = "dashboard.read";

export const hasPermission = (
    user: User | null | undefined,
    permission: string,
): boolean => !!user?.permissions?.includes(permission);

export const hasAdminAccess = (user: User | null | undefined): boolean =>
    hasPermission(user, ADMIN_ACCESS_PERMISSION);
