import { openMediaPicker } from "zmp-sdk";
import { API, BASE_URL } from "@constants/common";
import { request } from "./request";

export type AttachmentRelatedModel =
    | "HouseRecord"
    | "Business"
    | "BusinessDocument"
    | "Complaint"
    | "Request";

/**
 * Cap mot token upload ngan han (10 phut), gan chet vao dung mot ban ghi
 * (relatedModel/relatedId) - dung de nhung vao query string cua
 * serverUploadUrl truyen cho openMediaPicker (zmp-sdk), vi client Zalo tu
 * POST file thang den server, khong qua request() thong thuong nen khong
 * mang theo header Authorization cua phien dang nhap. Xem
 * quan-ly-to-dan-pho-hoa-binh-backend-app/src/app/api/uploads/token/route.ts.
 */
export interface UploadTokenResponse {
    token: string;
    expiresInSeconds: number;
}

export const createUploadToken = (
    relatedModel: AttachmentRelatedModel,
    relatedId: string,
): Promise<UploadTokenResponse> =>
    request<UploadTokenResponse>("POST", API.UPLOADS_TOKEN, {
        relatedModel,
        relatedId,
    });

/**
 * URL day du (co token) de truyen vao openMediaPicker({ serverUploadUrl }).
 */
export const buildUploadUrl = (token: string): string =>
    `${BASE_URL}${API.UPLOADS_ATTACHMENTS}?token=${encodeURIComponent(token)}`;

export interface PickedUpload {
    url: string;
    fileAssetId: string;
}

/**
 * Xin token upload, mo bo chon file cua Zalo (client tu POST thang len
 * serverUploadUrl - xem createUploadToken o tren) roi doc lai fileAssetId ma
 * server tra ve (xem /api/uploads/attachments) - can cho cac API can tham
 * chieu toi FileAsset vua tao (vd nop giay to cho ho kinh doanh), khong chi
 * URL nhu AttachmentUploader thong thuong.
 */
export async function pickAndUploadAttachment(
    relatedModel: AttachmentRelatedModel,
    relatedId: string,
): Promise<PickedUpload> {
    const { token } = await createUploadToken(relatedModel, relatedId);
    const serverUploadUrl = buildUploadUrl(token);

    const { data } = await openMediaPicker({
        type: "file",
        serverUploadUrl,
        maxSelectItem: 1,
    });
    const raw = Array.isArray(data) ? data[0] : data;
    let result: {
        error: number;
        message?: string;
        data?: { urls: string[]; fileAssetIds: string[] };
    };
    try {
        result = JSON.parse(raw);
    } catch (err) {
        // Zalo khong tra ve JSON hop le tu serverUploadUrl - thuong do request
        // toi may chu bi loi (vd endpoint chua duoc trien khai, mang loi) nen
        // Zalo nhan duoc phan hoi rong/khong hop le thay vi khung {error,...}
        // mong doi. Nem loi ro rang thay vi de SyntaxError kho hieu.
        throw new Error(
            "Không nhận được phản hồi hợp lệ khi tải file lên - vui lòng kiểm tra kết nối và thử lại",
        );
    }
    if (result.error !== 0) {
        throw new Error(result.message || "Tải file lên thất bại");
    }
    const url = result.data?.urls?.[0];
    const fileAssetId = result.data?.fileAssetIds?.[0];
    if (!url || !fileAssetId) {
        throw new Error("Phản hồi tải file lên thiếu dữ liệu cần thiết");
    }
    return { url, fileAssetId };
}
