import {
    getUserInfo,
    getAccessToken,
    getPhoneNumber as sdkGetPhoneNumber,
    authorize as sdkAuthorize,
    getSetting as sdkGetSetting,
    openPermissionSetting as sdkOpenPermissionSetting,
    requestSendNotification as sdkRequestSendNotification,
    followOA,
    openWebview,
    openMediaPicker,
    openSMS as sdkOpenSMS,
    openPhone as sdkOpenPhone,
    showToast as sdkShowToast,
} from "zmp-sdk";
import { ImageType } from "zmp-ui/image-viewer";

export type ZaloProfile = {
    id: string;
    name: string;
    avatar: string;
    idByOA?: string;
};

export const getZaloUserInfo = async (): Promise<ZaloProfile> => {
    try {
        const user = await getUserInfo({ avatarType: "normal" });
        const { userInfo } = user;
        return Promise.resolve(userInfo as unknown as ZaloProfile);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getToken = async (): Promise<string> => {
    try {
        // "ZALO_SANDBOX_TOKEN" cho moi truong dev/ZMP dev tools khi chua co Zalo App that
        const token = (await getAccessToken({})) || "ZALO_SANDBOX_TOKEN";
        return Promise.resolve(token);
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * Xin quyen truy cap thong tin nguoi dung (scope.userInfo) truoc khi goi getUserInfo/getPhoneNumber
 * o lan dau su dung, theo dung khuyen nghi cua Zalo Mini App.
 */
export const authorizeUserInfo = async (): Promise<boolean> => {
    try {
        const result = await sdkAuthorize({ scopes: ["scope.userInfo"] });
        return Boolean(result?.["scope.userInfo"]);
    } catch (err) {
        return false;
    }
};

/**
 * Lay so dien thoai nguoi dung (can quyen scope.userPhonenumber, thuong yeu cau OA da lien ket).
 * Tra ve undefined thay vi throw neu nguoi dung tu choi hoac chua du quyen.
 */
export const getPhoneNumber = async (): Promise<string | undefined> => {
    try {
        const res = await sdkGetPhoneNumber({});
        return res?.token ? res.token : undefined;
    } catch (err) {
        return undefined;
    }
};

export const followOfficialAccount = async ({
    id,
}: {
    id: string;
}): Promise<void> => {
    try {
        await followOA({ id });
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
};

export const openWebView = async (link: string): Promise<void> => {
    try {
        await openWebview({ url: link });
        return Promise.resolve();
    } catch (err) {
        throw err;
    }
};

export const openPhoneCall = (phoneNumber: string): void => {
    sdkOpenPhone({
        phoneNumber,
        success: () => undefined,
        fail: () => undefined,
    });
};

export const openSmsCompose = (phoneNumber: string, content?: string): void => {
    sdkOpenSMS({ phoneNumber, content } as any);
};

export const showToast = (message: string): void => {
    sdkShowToast({ text: message } as any);
};

/**
 * Kiem tra trang thai quyen thong bao hien tai cua Mini App.
 */
export const getNotificationSetting = async (): Promise<boolean> => {
    try {
        const setting = await sdkGetSetting({});
        return Boolean(
            (setting as any)?.authSetting?.["scope.userNotification"],
        );
    } catch (err) {
        return false;
    }
};

/**
 * Mo man hinh cai dat quyen cua Zalo khi nguoi dung da tu choi truoc do.
 */
export const openAppPermissionSetting = async (): Promise<void> => {
    try {
        await sdkOpenPermissionSetting({});
    } catch (err) {
        // Nguoi dung dong man hinh cai dat, khong can xu ly them
    }
};

/**
 * Xin quyen gui thong bao trong Mini App. Chi anh huong kenh in-app hien tai;
 * kenh Zalo OA that su can them tich hop OA (xem notificationAdapters ben backend).
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        await sdkRequestSendNotification({});
        return true;
    } catch (err) {
        return false;
    }
};

export interface PickImageParams {
    maxItemSize?: number;
    maxSelectItem?: number;
    serverUploadUrl: string;
}

export interface UploadImageResponse {
    domain: string;
    images: string[];
}

export const pickImages = async (
    params: PickImageParams,
): Promise<(ImageType & { name: string })[]> => {
    try {
        const res = await openMediaPicker({
            type: "photo",
            maxItemSize: params.maxItemSize || 1024 * 1024,
            maxSelectItem: params.maxSelectItem || 1,
            serverUploadUrl: params.serverUploadUrl,
        });
        const { data } = res;
        const result = JSON.parse(Array.isArray(data) ? data[0] : data);
        const { domain, images } = result.data as UploadImageResponse;
        const uploadedImgUrls = images.map(img => ({
            src: domain + img,
            name: img,
        }));
        return uploadedImgUrls;
    } catch (err) {
        return Promise.reject(err);
    }
};
