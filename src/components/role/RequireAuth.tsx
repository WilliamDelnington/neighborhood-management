import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import { Box, Spinner, useNavigate } from "zmp-ui";
import { useStore } from "@store";

/**
 * Bao boc mot man hinh yeu cau dang nhap. Trong khi dang bootstrap phien (goi Zalo + doi token
 * backend) se hien loading; neu that bai/chua co token se dieu huong ve trang dang nhap.
 */
const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();
    const [token, bootstrapping, bootstrapError] = useStore(state => [
        state.token,
        state.bootstrapping,
        state.bootstrapError,
    ]);

    useEffect(() => {
        if (!token && !bootstrapping && bootstrapError) {
            navigate("/login", { animate: true });
        }
    }, [token, bootstrapping, bootstrapError]);

    if (!token) {
        return (
            <Box
                flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ height: "100vh" }}
            >
                <Spinner visible />
                <Box mt={2} className="text-text_2 text-sm">
                    Đang đăng nhập...
                </Box>
            </Box>
        );
    }

    return children as ReactElement;
};

export default RequireAuth;
