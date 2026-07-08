import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { LoaiSoHuu, MucDoAnNinh, PaginatedData } from "@dts";
import { request } from "./request";

export type SecurityRecord = {
    _id: string;
    householdId:
        | { _id: string; code: string; address: string; cluster: string }
        | string;
    ownershipType: LoaiSoHuu;
    renterCount: number;
    temporaryResidenceDeclared: boolean;
    hasCamera: boolean;
    hasSecurityComplaint: boolean;
    level: MucDoAnNinh;
    reportedToPolice: boolean;
    handlingStatus?: string;
    note?: string;
    createdAt: string;
};

export interface ListSecurityParams {
    page?: number;
    limit?: number;
    level?: MucDoAnNinh;
    householdId?: string;
}

export const fetchSecurityRecords = (
    params: ListSecurityParams = {},
): Promise<PaginatedData<SecurityRecord>> =>
    request<PaginatedData<SecurityRecord>>("GET", API.SECURITY, {
        page: params.page || 1,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        level: params.level,
        householdId: params.householdId,
    });

export const fetchSecurityRecordById = (id: string): Promise<SecurityRecord> =>
    request<SecurityRecord>("GET", `${API.SECURITY}/${id}`);

export interface SecurityRecordInput {
    householdId: string;
    ownershipType?: LoaiSoHuu;
    renterCount?: number;
    temporaryResidenceDeclared?: boolean;
    hasCamera?: boolean;
    hasSecurityComplaint?: boolean;
    level?: MucDoAnNinh;
    reportedToPolice?: boolean;
    handlingStatus?: string;
    note?: string;
}

export const createSecurityRecord = (
    input: SecurityRecordInput,
): Promise<SecurityRecord> =>
    request<SecurityRecord>("POST", API.SECURITY, input);

export const updateSecurityRecord = (
    id: string,
    input: Partial<SecurityRecordInput>,
): Promise<SecurityRecord> =>
    request<SecurityRecord>("PATCH", `${API.SECURITY}/${id}`, input);

export const deleteSecurityRecord = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.SECURITY}/${id}`);
