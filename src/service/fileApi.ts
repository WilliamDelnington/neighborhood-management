import { API } from "@constants/common";
import { FileAsset, PaginatedData } from "@dts";
import { request } from "./request";

// Khong truyen useAuth: false nua - can gui kem token (neu da dang nhap) de
// backend biet role cua nguoi xem va loc theo targetRoles/audienceAll. Khach
// chua dang nhap van xem duoc binh thuong (chi thay cac file audienceAll=true).
export const fetchPublicFiles = (
    category?: string,
): Promise<PaginatedData<FileAsset>> =>
    request<PaginatedData<FileAsset>>("GET", API.FILES, { category });
