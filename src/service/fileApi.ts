import { API } from "@constants/common";
import { FileAsset, PaginatedData } from "@dts";
import { request } from "./request";

export const fetchPublicFiles = (
    category?: string,
): Promise<PaginatedData<FileAsset>> =>
    request<PaginatedData<FileAsset>>(
        "GET",
        API.FILES,
        { category },
        { useAuth: false },
    );

export const fetchAdminFiles = (): Promise<PaginatedData<FileAsset>> =>
    request<PaginatedData<FileAsset>>("GET", API.FILES, { admin: 1 });

export interface FileAssetInput {
    name: string;
    description?: string;
    url: string;
    category?: "form" | "attachment" | "minutes" | "other";
    isPublic?: boolean;
}

export const createFileAsset = (input: FileAssetInput): Promise<FileAsset> =>
    request<FileAsset>("POST", API.FILES, input);

export const updateFileAsset = (
    id: string,
    input: Partial<FileAssetInput>,
): Promise<FileAsset> =>
    request<FileAsset>("PATCH", `${API.FILES}/${id}`, input);

export const deleteFileAsset = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.FILES}/${id}`);
