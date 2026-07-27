import React, { useEffect, useState } from "react";
import { Box, Text, useLocation, useNavigate, useSnackbar } from "zmp-ui";
import { PageLayout } from "@components/layout";
import { Button, Input } from "@components/customized";
import { useStore } from "@store";
import { updateMyProfile } from "@service/authApi";
import { ROLE_LABEL } from "@constants/domain";
import { Household, Role } from "@dts";
import { isValidVietnamesePhone } from "@utils/string";
import {
    HouseholdPickerSheet,
    NeighborhoodPickerSheet,
} from "@components/household";
import Logo from "@assets/logo.png";

type PhoneAuthMode = "hidden" | "login" | "register";

/**
 * Danh sach tai khoan mau tao boi backend-app/scripts/seed.ts - dung de test nhanh tung vai tro
 * trong luc dev, vi mot tai khoan Zalo that la duy nhat nen khong the dung 1 tai khoan Zalo
 * de kiem tra ca 6 vai tro. Neu doi zaloUserId trong seed.ts thi phai sua lai o day.
 */
const DEV_TEST_ACCOUNTS: { zaloUserId: string; name: string; role: Role }[] = [
    { zaloUserId: "seed-admin", name: "Quản trị viên Hòa Bình", role: "admin" },
    {
        zaloUserId: "seed-leader",
        name: "Nguyễn Văn Tổ Trưởng",
        role: "neighborhood_leader",
    },
    {
        zaloUserId: "seed-secretary",
        name: "Trần Thị Bí Thư",
        role: "secretary",
    },
    {
        zaloUserId: "seed-police",
        name: "Lê Văn Công An",
        role: "regional_police",
    },
    {
        zaloUserId: "seed-committee",
        name: "Phạm Thị Cán Bộ UBND",
        role: "people_committee_official",
    },
    { zaloUserId: "seed-resident", name: "Hoàng Văn Dân", role: "resident" },
];

/**
 * Man hinh dang nhap: san pham chinh thuc chi dang nhap bang Zalo. Kenh dang nhap
 * bang so dien thoai + mat khau chi hien khi import.meta.env.DEV (build dev), dung
 * de test khi chua co tai khoan Zalo sandbox phu hop - khong duoc bat trong production.
 * Sau do la buoc hoan tat onboarding (dia chi) cho nguoi dung moi.
 */
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { openSnackbar } = useSnackbar();
    const [address, setAddress] = useState("");
    const [neighborhood, setNeighborhood] = useState<string | null>(null);
    const [neighborhoodPickerVisible, setNeighborhoodPickerVisible] =
        useState(false);
    const [household, setHousehold] = useState<Household | null>(null);
    const [householdPickerVisible, setHouseholdPickerVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [phoneAuthMode, setPhoneAuthMode] = useState<PhoneAuthMode>("hidden");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [
        token,
        user,
        bootstrapping,
        bootstrapError,
        bootstrapSession,
        loginAsTestUser,
        loginWithPhone,
        registerWithPhone,
        refreshMe,
    ] = useStore(state => [
        state.token,
        state.user,
        state.bootstrapping,
        state.bootstrapError,
        state.bootstrapSession,
        state.loginAsTestUser,
        state.loginWithPhone,
        state.registerWithPhone,
        state.refreshMe,
    ]);

    const needsOnboarding = !!user && !user.address;

    useEffect(() => {
        // Sau khi dang nhap thanh cong (va da hoan tat onboarding neu can), dieu huong
        // ve trang nguoi dung dinh vao ban dau (RequireAuth luu trong location.state.from)
        // hoac trang chu - truoc day khong co redirect nao ca nen man hinh dang nhap
        // "dung im" sau khi bam nut, trong nhu nut khong hoat dong.
        if (token && !needsOnboarding) {
            const from =
                (location.state as { from?: string } | null)?.from || "/";
            navigate(from, { animate: true, replace: true });
        }
    }, [token, needsOnboarding]);

    const handleLogin = () => {
        bootstrapSession();
    };

    const handleLoginAsTestUser = (zaloUserId: string, name: string) => {
        loginAsTestUser(zaloUserId, name);
    };

    const handlePhoneSubmit = () => {
        if (!isValidVietnamesePhone(phone.trim())) {
            openSnackbar({
                type: "error",
                text: "Số điện thoại không hợp lệ",
            });
            return;
        }
        if (password.length < 6) {
            openSnackbar({
                type: "error",
                text: "Mật khẩu phải có ít nhất 6 ký tự",
            });
            return;
        }
        if (phoneAuthMode === "register") {
            if (!displayName.trim()) {
                openSnackbar({ type: "error", text: "Vui lòng nhập họ tên" });
                return;
            }
            if (password !== confirmPassword) {
                openSnackbar({
                    type: "error",
                    text: "Mật khẩu nhập lại không khớp",
                });
                return;
            }
            registerWithPhone(phone.trim(), password, displayName.trim());
        } else {
            loginWithPhone(phone.trim(), password);
        }
    };

    const handleSelectNeighborhood = (selected: string) => {
        setNeighborhood(selected);
        setHousehold(null);
    };

    const handleCompleteOnboarding = async () => {
        if (!neighborhood) {
            openSnackbar({ type: "error", text: "Vui lòng chọn tổ dân phố" });
            return;
        }
        if (!household) {
            openSnackbar({ type: "error", text: "Vui lòng chọn hộ khẩu" });
            return;
        }
        if (!address.trim()) {
            openSnackbar({ type: "error", text: "Vui lòng nhập địa chỉ" });
            return;
        }
        try {
            setSubmitting(true);
            await updateMyProfile({
                address: address.trim(),
                householdId: household._id,
            });
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

    const householdLabel = household
        ? `${household.code} — ${household.address}`
        : "Chọn hộ khẩu...";
    const householdPlaceholder = neighborhood
        ? householdLabel
        : "Chọn tổ dân phố trước";

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

                {import.meta.env.DEV && !token && phoneAuthMode === "hidden" && (
                    <Text
                        size="xSmall"
                        className="text-white mt-4 text-center"
                        onClick={() => setPhoneAuthMode("login")}
                    >
                        Đăng nhập bằng số điện thoại
                    </Text>
                )}

                {import.meta.env.DEV && !token && phoneAuthMode !== "hidden" && (
                    <Box className="bg-white rounded-2xl p-4 w-full mt-6">
                        <Text.Title size="small">
                            {phoneAuthMode === "register"
                                ? "Đăng ký tài khoản"
                                : "Đăng nhập bằng số điện thoại"}
                        </Text.Title>

                        {phoneAuthMode === "register" && (
                            <Box mt={3}>
                                <Input
                                    label="Họ tên"
                                    value={displayName}
                                    onChange={e =>
                                        setDisplayName(e.target.value)
                                    }
                                />
                            </Box>
                        )}
                        <Box mt={3}>
                            <Input
                                label="Số điện thoại"
                                placeholder="0xxxxxxxxx"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </Box>
                        <Box mt={3}>
                            <Input
                                type="password"
                                label="Mật khẩu"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Box>
                        {phoneAuthMode === "register" && (
                            <Box mt={3}>
                                <Input
                                    type="password"
                                    label="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={e =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </Box>
                        )}

                        <Box mt={4}>
                            <Button
                                fullWidth
                                loading={bootstrapping}
                                onClick={handlePhoneSubmit}
                            >
                                {phoneAuthMode === "register"
                                    ? "Đăng ký"
                                    : "Đăng nhập"}
                            </Button>
                        </Box>

                        <Text
                            size="xSmall"
                            className="text-main text-center mt-3"
                            onClick={() =>
                                setPhoneAuthMode(
                                    phoneAuthMode === "register"
                                        ? "login"
                                        : "register",
                                )
                            }
                        >
                            {phoneAuthMode === "register"
                                ? "Đã có tài khoản? Đăng nhập"
                                : "Chưa có tài khoản? Đăng ký"}
                        </Text>
                    </Box>
                )}

                {import.meta.env.DEV && !token && (
                    <Box className="bg-white/10 rounded-2xl p-4 w-full mt-6">
                        <Text
                            size="xSmall"
                            className="text-white font-medium mb-2"
                        >
                            Tài khoản thử nghiệm (chỉ hiện khi dev)
                        </Text>
                        <Text size="xxSmall" className="text-wth_a70 mb-3">
                            Dùng để kiểm tra giao diện theo từng vai trò mà
                            không cần nhiều tài khoản Zalo thật. Yêu cầu đã chạy
                            `npm run seed` ở backend-app.
                        </Text>
                        <Box flex flexDirection="column" style={{ gap: 8 }}>
                            {DEV_TEST_ACCOUNTS.map(account => (
                                <Button
                                    key={account.zaloUserId}
                                    fullWidth
                                    variant="secondary"
                                    loading={bootstrapping}
                                    onClick={() =>
                                        handleLoginAsTestUser(
                                            account.zaloUserId,
                                            account.name,
                                        )
                                    }
                                    className="!bg-white/90 !text-main"
                                >
                                    {ROLE_LABEL[account.role]} — {account.name}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                )}

                {needsOnboarding && (
                    <Box className="bg-white rounded-2xl p-4 w-full mt-4">
                        <Text.Title size="small">Hoàn tất thông tin</Text.Title>
                        <Text size="xSmall" className="text-text_2 mb-3">
                            Vui lòng chọn tổ dân phố, hộ khẩu và cho biết địa
                            chỉ để tổ dân phố hỗ trợ tốt hơn.
                        </Text>
                        <Box mb={3}>
                            <Text size="xSmall" className="text-text_2 mb-1">
                                Tổ dân phố
                            </Text>
                            <Box
                                className="bg-ng_10 rounded-lg px-3 py-2"
                                onClick={() =>
                                    setNeighborhoodPickerVisible(true)
                                }
                            >
                                <Text
                                    size="small"
                                    className={
                                        neighborhood ? "" : "text-text_3"
                                    }
                                >
                                    {neighborhood || "Chọn tổ dân phố..."}
                                </Text>
                            </Box>
                        </Box>
                        <Box mb={3}>
                            <Text size="xSmall" className="text-text_2 mb-1">
                                Hộ khẩu
                            </Text>
                            <Box
                                className={`rounded-lg px-3 py-2 ${
                                    neighborhood
                                        ? "bg-ng_10"
                                        : "bg-ng_10 opacity-50"
                                }`}
                                onClick={() =>
                                    neighborhood &&
                                    setHouseholdPickerVisible(true)
                                }
                            >
                                <Text
                                    size="small"
                                    className={household ? "" : "text-text_3"}
                                >
                                    {householdPlaceholder}
                                </Text>
                            </Box>
                        </Box>
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
                        <NeighborhoodPickerSheet
                            visible={neighborhoodPickerVisible}
                            onClose={() => setNeighborhoodPickerVisible(false)}
                            onSelect={handleSelectNeighborhood}
                        />
                        <HouseholdPickerSheet
                            visible={householdPickerVisible}
                            cluster={neighborhood || undefined}
                            onClose={() => setHouseholdPickerVisible(false)}
                            onSelect={setHousehold}
                        />
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default LoginPage;
