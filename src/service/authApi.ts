import { API } from "@constants/common";
import { User } from "@dts";
import { request } from "./request";

export interface LoginWithZaloParams {
    accessToken: string;
    zaloUserId: string;
    name?: string;
    avatarUrl?: string;
    phone?: string;
}

export interface LoginWithZaloResponse {
    token: string;
    user: User;
}

export const loginWithZalo = (
    params: LoginWithZaloParams,
): Promise<LoginWithZaloResponse> =>
    request<LoginWithZaloResponse>("POST", API.AUTH_ZALO_LOGIN, params, {
        useAuth: false,
    });

export const fetchMe = (): Promise<User> => request<User>("GET", API.AUTH_ME);

export interface PhoneRegisterParams {
    phone: string;
    password: string;
    displayName: string;
}

export const registerWithPhone = (
    params: PhoneRegisterParams,
): Promise<LoginWithZaloResponse> =>
    request<LoginWithZaloResponse>("POST", API.AUTH_REGISTER, params, {
        useAuth: false,
    });

export interface PhoneLoginParams {
    phone: string;
    password: string;
}

export const loginWithPhone = (
    params: PhoneLoginParams,
): Promise<LoginWithZaloResponse> =>
    request<LoginWithZaloResponse>("POST", API.AUTH_LOGIN, params, {
        useAuth: false,
    });

export const setPassword = (
    password: string,
    currentPassword?: string,
): Promise<User> =>
    request<User>("POST", API.AUTH_SET_PASSWORD, {
        password,
        currentPassword,
    });

// displayName KHONG con o day - tu "danh tinh", chi sua duoc qua ChangeRequest
// (xem changeRequestApi.ts) - email duoc them vao vi truoc gio ton tai tren
// User nhung chua tung sua duoc qua man tu-cap-nhat nay.
export interface UpdateProfileParams {
    phone?: string;
    email?: string;
    address?: string;
    householdId?: string;
    notificationPermission?: boolean;
}

export const updateMyProfile = (params: UpdateProfileParams): Promise<User> =>
    request<User>("PATCH", API.AUTH_ME, params);

export const logout = (): Promise<null> =>
    request<null>("POST", API.AUTH_LOGOUT);
