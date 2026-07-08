import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { Complaint, ComplaintDetail, NhomPhanAnh, PaginatedData } from "@dts";
import { request } from "./request";

export interface CreateComplaintParams {
    category: NhomPhanAnh;
    title: string;
    content: string;
    area?: string;
    images?: string[];
}

export const createComplaint = (
    params: CreateComplaintParams,
): Promise<Complaint> => request<Complaint>("POST", API.COMPLAINTS, params);

export const fetchMyComplaints = (
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
): Promise<PaginatedData<Complaint>> =>
    request<PaginatedData<Complaint>>("GET", API.COMPLAINTS_MINE, {
        page,
        limit,
    });

export const lookupComplaintByCode = (code: string): Promise<ComplaintDetail> =>
    request<ComplaintDetail>(
        "GET",
        API.COMPLAINTS_LOOKUP,
        { code },
        { useAuth: false },
    );

export const fetchComplaintDetail = (id: string): Promise<ComplaintDetail> =>
    request<ComplaintDetail>("GET", `${API.COMPLAINTS}/${id}`);

export interface ListComplaintsParams {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
}

export const fetchComplaints = (
    params: ListComplaintsParams,
): Promise<PaginatedData<Complaint>> =>
    request<PaginatedData<Complaint>>("GET", API.COMPLAINTS, {
        page: params.page || 1,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        status: params.status,
        category: params.category,
        search: params.search,
    });

export interface UpdateComplaintStatusParams {
    status: string;
    note?: string;
    isPublic?: boolean;
}

export const updateComplaintStatus = (
    id: string,
    params: UpdateComplaintStatusParams,
): Promise<Complaint> =>
    request<Complaint>("PATCH", `${API.COMPLAINTS}/${id}/status`, params);

export const assignComplaint = (
    id: string,
    assigneeId: string,
    expectedCompletionDate?: string,
): Promise<Complaint> =>
    request<Complaint>("PATCH", `${API.COMPLAINTS}/${id}/assign`, {
        assigneeId,
        expectedCompletionDate,
    });
