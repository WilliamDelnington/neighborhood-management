import { API } from "@constants/common";
import { BusinessType, PaginatedData } from "@dts";
import { request } from "./request";

export const fetchBusinessTypes = (
    params: {
        search?: string;
        active?: boolean;
        page?: number;
        limit?: number;
    } = {},
): Promise<PaginatedData<BusinessType>> => {
    let active: string | undefined;
    if (params.active !== undefined) {
        active = params.active ? "1" : "0";
    }
    return request<PaginatedData<BusinessType>>("GET", API.BUSINESS_TYPES, {
        search: params.search,
        active,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
    });
};

export const fetchBusinessTypeById = (id: string): Promise<BusinessType> =>
    request<BusinessType>("GET", `${API.BUSINESS_TYPES}/${id}`);

export interface BusinessTypeInput {
    name: string;
    description?: string;
    active?: boolean;
    sortOrder?: number;
}

export const createBusinessType = (
    input: BusinessTypeInput,
): Promise<BusinessType> =>
    request<BusinessType>("POST", API.BUSINESS_TYPES, input);

export const updateBusinessType = (
    id: string,
    input: Partial<BusinessTypeInput>,
): Promise<BusinessType> =>
    request<BusinessType>("PATCH", `${API.BUSINESS_TYPES}/${id}`, input);

export const deleteBusinessType = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.BUSINESS_TYPES}/${id}`);
