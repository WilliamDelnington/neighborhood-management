import React, { PropsWithChildren } from "react";
import { RequireAuth, RequireRole } from "@components/role";
import { Role } from "@dts";

export interface AdminGuardProps extends PropsWithChildren {
    roles: Role[];
}

/**
 * Ket hop RequireAuth + RequireRole - dung o dau moi trang trong khu vuc /admin.
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ roles, children }) => (
    <RequireAuth>
        <RequireRole roles={roles}>{children}</RequireRole>
    </RequireAuth>
);

export default AdminGuard;
