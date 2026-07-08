import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { Citizen, GioiTinh, LoaiCuTru, PaginatedData } from "@dts";
import { request } from "./request";

export interface ListCitizensParams {
    page?: number;
    limit?: number;
    search?: string;
    householdId?: string;
}

export const fetchCitizens = (
    params: ListCitizensParams = {},
): Promise<PaginatedData<Citizen>> =>
    request<PaginatedData<Citizen>>("GET", API.CITIZENS, {
        page: params.page || 1,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        search: params.search,
        householdId: params.householdId,
    });

export const fetchCitizenById = (id: string): Promise<Citizen> =>
    request<Citizen>("GET", `${API.CITIZENS}/${id}`);

export interface CitizenInput {
    fullName: string;
    phone?: string;
    cccd?: string;
    birthDate?: string;
    gender?: GioiTinh;
    relationToHead?: string;
    householdId: string;
    residenceType?: LoaiCuTru;
    isElderly?: boolean;
    isChild?: boolean;
    isDisabledOrSupportNeeded?: boolean;
    isPartyMember?: boolean;
    isUnionMember?: boolean;
}

export const createCitizen = (input: CitizenInput): Promise<Citizen> =>
    request<Citizen>("POST", API.CITIZENS, input);

export const updateCitizen = (
    id: string,
    input: Partial<CitizenInput>,
): Promise<Citizen> =>
    request<Citizen>("PATCH", `${API.CITIZENS}/${id}`, input);

export const deleteCitizen = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.CITIZENS}/${id}`);
