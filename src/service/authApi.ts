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

export interface UpdateProfileParams {
    displayName?: string;
    phone?: string;
    address?: string;
    notificationPermission?: boolean;
}

export const updateMyProfile = (params: UpdateProfileParams): Promise<User> =>
    request<User>("PATCH", API.AUTH_ME, params);

export const logout = (): Promise<null> =>
    request<null>("POST", API.AUTH_LOGOUT);
