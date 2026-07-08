import React, { PropsWithChildren, ReactElement } from "react";
import { Box, Icon, Text } from "zmp-ui";
import { useStore } from "@store";
import { Role } from "@dts";

export interface RequireRoleProps extends PropsWithChildren {
    roles: Role[];
}

/**
 * Chi hien thi noi dung neu vai tro hien tai cua nguoi dung nam trong danh sach cho phep.
 * Dung de an cac man hinh/nut chuc nang quan tri khoi nguoi dan, va nguoc lai.
 */
const RequireRole: React.FC<RequireRoleProps> = ({ roles, children }) => {
    const user = useStore(state => state.user);
    const allowed = !!user && user.roles.some(r => roles.includes(r));

    if (!allowed) {
        return (
            <Box
                flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={6}
                className="text-center"
            >
                <Icon icon="zi-warning" className="text-text_3" size={40} />
                <Text.Title size="small" className="mt-3">
                    Bạn không có quyền truy cập
                </Text.Title>
                <Text size="xSmall" className="text-text_2 mt-1">
                    Tính năng này chỉ dành cho cán bộ tổ dân phố.
                </Text>
            </Box>
        );
    }

    return children as ReactElement;
};

export default RequireRole;
