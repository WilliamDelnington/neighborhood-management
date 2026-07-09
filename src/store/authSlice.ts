import { User } from "@dts";
import { StateCreator } from "zustand";
import { getToken, getZaloUserInfo, authorizeUserInfo } from "@service/zalo";
import { loginWithZalo, fetchMe } from "@service/authApi";

export interface AuthSlice {
    token?: string;
    user?: User;
    bootstrapping: boolean;
    bootstrapError?: string;
    setToken: (token?: string) => void;
    setUser: (user?: User) => void;
    /**
     * Dang nhap bang Zalo: xin quyen -> lay accessToken + thong tin ho so ->
     * doi lay session token cua backend -> luu ca hai vao store.
     */
    bootstrapSession: () => Promise<void>;
    /**
     * Chi dung khi dev (xem LoginPage - khoi "tai khoan thu nghiem"). Dang nhap thang bang mot
     * zaloUserId tuy chon, bo qua zmp-sdk. Chi hoat dong khi backend dang ZALO_ENV=sandbox (tin
     * tuong zaloUserId tu client) - can de test nhanh cac vai tro ma khong can nhieu tai khoan
     * Zalo that (moi tai khoan Zalo la duy nhat nen khong the dung 1 tai khoan cho nhieu vai tro).
     */
    loginAsTestUser: (zaloUserId: string, name?: string) => Promise<void>;
    refreshMe: () => Promise<void>;
    logout: () => void;
}

const authSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => ({
    token: undefined,
    user: undefined,
    bootstrapping: false,
    bootstrapError: undefined,
    setToken: (token?: string) => set(state => ({ ...state, token })),
    setUser: (user?: User) => set(state => ({ ...state, user })),
    bootstrapSession: async () => {
        if (get().bootstrapping) return;
        set(state => ({
            ...state,
            bootstrapping: true,
            bootstrapError: undefined,
        }));
        try {
            const accessToken = await getToken();
            await authorizeUserInfo();

            let zaloUserId = "";
            let name: string | undefined;
            let avatarUrl: string | undefined;
            try {
                const info = await getZaloUserInfo();
                zaloUserId = info.id;
                name = info.name;
                avatarUrl = info.avatar;
            } catch {
                // Nguoi dung tu choi quyen ho so - van cho phep dang nhap voi ID toi thieu
                zaloUserId = `sandbox-${accessToken}`;
            }

            const { token, user } = await loginWithZalo({
                accessToken,
                zaloUserId,
                name,
                avatarUrl,
            });

            set(state => ({ ...state, token, user }));
        } catch (err: any) {
            set(state => ({
                ...state,
                bootstrapError: err?.message || "Không thể đăng nhập Zalo",
            }));
        } finally {
            set(state => ({ ...state, bootstrapping: false }));
        }
    },
    loginAsTestUser: async (zaloUserId: string, name?: string) => {
        if (get().bootstrapping) return;
        set(state => ({
            ...state,
            bootstrapping: true,
            bootstrapError: undefined,
        }));
        try {
            const { token, user } = await loginWithZalo({
                accessToken: `dev-test-token-${zaloUserId}`,
                zaloUserId,
                name,
            });
            set(state => ({ ...state, token, user }));
        } catch (err: any) {
            set(state => ({
                ...state,
                bootstrapError:
                    err?.message || "Không thể đăng nhập tài khoản thử nghiệm",
            }));
        } finally {
            set(state => ({ ...state, bootstrapping: false }));
        }
    },
    refreshMe: async () => {
        try {
            const user = await fetchMe();
            set(state => ({ ...state, user }));
        } catch {
            // Token het han - request.ts da tu xoa token, khong can xu ly them
        }
    },
    logout: () => {
        set(state => ({ ...state, token: undefined, user: undefined }));
    },
});

export default authSlice;
