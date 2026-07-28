import { API } from "@constants/common";
import { Business, Household, House, HouseStatus, PaginatedData } from "@dts";
import { request } from "./request";

/**
 * Yeu cau quyen houses.read. Backend tu gioi han theo ownerId (house_owner)
 * hoac assignedClusters (nhan vien) cua nguoi goi (xem houseScopeFilter trong
 * quan-ly-to-dan-pho-hoa-binh-backend-app), nen khong can loc them o client.
 */
export const fetchHouses = (params: {
    search?: string;
    cluster?: string;
    status?: HouseStatus;
    page?: number;
    limit?: number;
}): Promise<PaginatedData<House>> =>
    request<PaginatedData<House>>("GET", API.HOUSES, {
        search: params.search,
        cluster: params.cluster,
        status: params.status,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
    });

export const fetchHouseById = (id: string): Promise<House> =>
    request<House>("GET", `${API.HOUSES}/${id}`);

export const fetchHouseHouseholds = (
    id: string,
    params: { page?: number; limit?: number } = {},
): Promise<PaginatedData<Household>> =>
    request<PaginatedData<Household>>("GET", `${API.HOUSES}/${id}/households`, {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
    });

export const fetchHouseBusinesses = (
    id: string,
    params: { page?: number; limit?: number } = {},
): Promise<PaginatedData<Business>> =>
    request<PaginatedData<Business>>("GET", `${API.HOUSES}/${id}/businesses`, {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
    });

export interface HouseInput {
    cluster: string;
    address: string;
    note?: string;
}

export const createHouse = (input: HouseInput): Promise<House> =>
    request<House>("POST", API.HOUSES, input);

export const updateHouse = (
    id: string,
    input: Partial<HouseInput>,
): Promise<House> => request<House>("PATCH", `${API.HOUSES}/${id}`, input);

export const updateHouseStatus = (
    id: string,
    status: HouseStatus,
): Promise<House> =>
    request<House>("PATCH", `${API.HOUSES}/${id}/status`, { status });

export const deleteHouse = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.HOUSES}/${id}`);
