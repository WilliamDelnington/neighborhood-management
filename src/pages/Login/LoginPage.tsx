import React, { useState } from "react";
import { Box, Text, useNavigate, useSnackbar } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { Button, Input } from "@components/customized";
import { useStore } from "@store";
import { updateMyProfile } from "@service/authApi";
import Logo from "@assets/logo.png";

/**
 * Man hinh dang nhap bang Zalo + hoan tat onboarding (dia chi) cho nguoi dung moi.
 * Theo yeu cau: khong dung dang nhap sdt/mat khau lam kenh chinh cho Mini App nay.
 */
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [address, setAddress] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [
        token,
        user,
        bootstrapping,
        bootstrapError,
        bootstrapSession,
        refreshMe,
    ] = useStore(state => [
        state.token,
        state.user,
        state.bootstrapping,
        state.bootstrapError,
        state.bootstrapSession,
        state.refreshMe,
    ]);

    const needsOnboarding = !!user && !user.address;

    const handleLogin = () => {
        bootstrapSession();
    };

    const handleCompleteOnboarding = async () => {
        if (!address.trim()) {
            openSnackbar({ type: "error", text: "Vui lòng nhập địa chỉ" });
            return;
        }
        try {
            setSubmitting(true);
            await updateMyProfile({ address: address.trim() });
            await refreshMe();
            navigate("/", { animate: true });
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Có lỗi xảy ra",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageLayout
            id="login-page"
            customHeader={<Box className="h-[env(safe-area-inset-top)]" />}
            bg="#2563EB"
        >
            <Box
                flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "80vh" }}
                p={6}
            >
                <img src={Logo} alt="Logo" style={{ width: 72, height: 72 }} />
                <Text.Title
                    size="large"
                    className="text-white mt-4 text-center"
                >
                    Tổ dân phố Hòa Bình
                </Text.Title>
                <Text size="small" className="text-wth_a70 mb-8 text-center">
                    Phường Dương Nội, Hà Nội
                </Text>

                {!token && !needsOnboarding && (
                    <Button
                        fullWidth
                        loading={bootstrapping}
                        onClick={handleLogin}
                        className="!bg-white !text-main"
                    >
                        Đăng nhập bằng Zalo
                    </Button>
                )}

                {!token && bootstrapError && (
                    <Text
                        size="xSmall"
                        className="text-red-100 mt-3 text-center"
                    >
                        {bootstrapError}
                    </Text>
                )}

                {needsOnboarding && (
                    <Box className="bg-white rounded-2xl p-4 w-full mt-4">
                        <Text.Title size="small">Hoàn tất thông tin</Text.Title>
                        <Text size="xSmall" className="text-text_2 mb-3">
                            Vui lòng cho biết địa chỉ để tổ dân phố hỗ trợ tốt
                            hơn.
                        </Text>
                        <Input
                            label="Địa chỉ"
                            placeholder="Số nhà, ngõ, cụm dân cư..."
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                        <Box mt={4}>
                            <Button
                                fullWidth
                                loading={submitting}
                                onClick={handleCompleteOnboarding}
                            >
                                Hoàn tất
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default LoginPage;
