import { User } from "@dts";
import { StateCreator } from "zustand";
import {
    getToken,
    getZaloUserInfo,
    getPhoneNumber,
    authorizeUserInfo,
} from "@service/zalo";
import {
    loginWithZalo,
    loginWithPhone,
    registerWithPhone,
    fetchMe,
} from "@service/authApi";

export interface AuthSlice {
    token?: string;
    user?: User;
    bootstrapping: boolean;
    bootstrapError?: string;
    /**
     * Dem tang dan moi khi mot luot dang nhap moi bat dau (bootstrapSession hoac
     * loginAsTestUser). Dung de dam bao luot dang nhap duoc khoi tao SAU CUNG luon
     * la luot duoc ap dung vao store - tranh truong hop luot dang nhap Zalo that
     * (tu dong chay khi app mo, thuong cham hon vi phai qua nhieu buoc SDK) tra ve
     * SAU va de len ket qua cua luot dang nhap tai khoan thu nghiem nguoi dung vua
     * bam, khien viec chon tai khoan thu nghiem trong "im lang" khong co tac dung.
     */
    loginSeq: number;
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
    /**
     * Dang nhap bang so dien thoai + mat khau, kenh doc lap voi Zalo.
     */
    loginWithPhone: (phone: string, password: string) => Promise<void>;
    /**
     * Dang ky tai khoan moi bang so dien thoai + mat khau va dang nhap luon.
     */
    registerWithPhone: (
        phone: string,
        password: string,
        displayName: string,
    ) => Promise<void>;
    refreshMe: () => Promise<void>;
    logout: () => void;
}

const authSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => ({
    token: undefined,
    user: undefined,
    bootstrapping: false,
    bootstrapError: undefined,
    loginSeq: 0,
    setToken: (token?: string) => set(state => ({ ...state, token })),
    setUser: (user?: User) => set(state => ({ ...state, user })),
    bootstrapSession: async () => {
        const mySeq = get().loginSeq + 1;
        set(state => ({
            ...state,
            loginSeq: mySeq,
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

            // getPhoneNumber returns a one-time code. The backend exchanges
            // it with Zalo and links the verified phone to the Zalo identity.
            const phoneToken = await getPhoneNumber();
            if (!phoneToken && import.meta.env.PROD) {
                throw new Error(
                    "Vui lòng cho phép chia sẻ số điện thoại để liên kết tài khoản chủ hộ",
                );
            }

            const { token, user } = await loginWithZalo({
                accessToken,
                zaloUserId,
                name,
                avatarUrl,
                phoneToken,
            });

            // Neu trong luc cho phan hoi tu backend, mot luot dang nhap moi hon
            // (vd. bam tai khoan thu nghiem) da bat dau, bo qua ket qua cu nay.
            if (get().loginSeq !== mySeq) return;
            set(state => ({ ...state, token, user }));
        } catch (err: any) {
            if (get().loginSeq === mySeq) {
                set(state => ({
                    ...state,
                    bootstrapError: err?.message || "Không thể đăng nhập Zalo",
                }));
            }
        } finally {
            if (get().loginSeq === mySeq) {
                set(state => ({ ...state, bootstrapping: false }));
            }
        }
    },
    loginAsTestUser: async (zaloUserId: string, name?: string) => {
        const mySeq = get().loginSeq + 1;
        set(state => ({
            ...state,
            loginSeq: mySeq,
            bootstrapping: true,
            bootstrapError: undefined,
        }));
        try {
            const { token, user } = await loginWithZalo({
                accessToken: `dev-test-token-${zaloUserId}`,
                zaloUserId,
                name,
            });
            if (get().loginSeq !== mySeq) return;
            set(state => ({ ...state, token, user }));
        } catch (err: any) {
            if (get().loginSeq === mySeq) {
                set(state => ({
                    ...state,
                    bootstrapError:
                        err?.message ||
                        "Không thể đăng nhập tài khoản thử nghiệm",
                }));
            }
        } finally {
            if (get().loginSeq === mySeq) {
                set(state => ({ ...state, bootstrapping: false }));
            }
        }
    },
    loginWithPhone: async (phone: string, password: string) => {
        const mySeq = get().loginSeq + 1;
        set(state => ({
            ...state,
            loginSeq: mySeq,
            bootstrapping: true,
            bootstrapError: undefined,
        }));
        try {
            const { token, user } = await loginWithPhone({ phone, password });
            if (get().loginSeq !== mySeq) return;
            set(state => ({ ...state, token, user }));
        } catch (err: any) {
            if (get().loginSeq === mySeq) {
                set(state => ({
                    ...state,
                    bootstrapError: err?.message || "Không thể đăng nhập",
                }));
            }
        } finally {
            if (get().loginSeq === mySeq) {
                set(state => ({ ...state, bootstrapping: false }));
            }
        }
    },
    registerWithPhone: async (
        phone: string,
        password: string,
        displayName: string,
    ) => {
        const mySeq = get().loginSeq + 1;
        set(state => ({
            ...state,
            loginSeq: mySeq,
            bootstrapping: true,
            bootstrapError: undefined,
        }));
        try {
            const { token, user } = await registerWithPhone({
                phone,
                password,
                displayName,
            });
            if (get().loginSeq !== mySeq) return;
            set(state => ({ ...state, token, user }));
        } catch (err: any) {
            if (get().loginSeq === mySeq) {
                set(state => ({
                    ...state,
                    bootstrapError: err?.message || "Không thể đăng ký",
                }));
            }
        } finally {
            if (get().loginSeq === mySeq) {
                set(state => ({ ...state, bootstrapping: false }));
            }
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
