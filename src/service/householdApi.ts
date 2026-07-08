import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { Citizen, Household, LoaiSoHuu, PaginatedData } from "@dts";
import { request } from "./request";

export interface ListHouseholdsParams {
    page?: number;
    limit?: number;
    search?: string;
    cluster?: string;
}

export const fetchHouseholds = (
    params: ListHouseholdsParams = {},
): Promise<PaginatedData<Household>> =>
    request<PaginatedData<Household>>("GET", API.HOUSEHOLDS, {
        page: params.page || 1,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        search: params.search,
        cluster: params.cluster,
    });

export const fetchHouseholdById = (id: string): Promise<Household> =>
    request<Household>("GET", `${API.HOUSEHOLDS}/${id}`);

export const fetchHouseholdCitizens = (id: string): Promise<Citizen[]> =>
    request<Citizen[]>("GET", `${API.HOUSEHOLDS}/${id}/citizens`);

export interface HouseholdInput {
    cluster: string;
    address: string;
    headOfHousehold: string;
    phone?: string;
    memberCount?: number;
    ownershipType?: LoaiSoHuu;
    needsSupport?: boolean;
    note?: string;
}

export const createHousehold = (input: HouseholdInput): Promise<Household> =>
    request<Household>("POST", API.HOUSEHOLDS, input);

export const updateHousehold = (
    id: string,
    input: Partial<HouseholdInput>,
): Promise<Household> =>
    request<Household>("PATCH", `${API.HOUSEHOLDS}/${id}`, input);

export const deleteHousehold = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.HOUSEHOLDS}/${id}`);
