import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import {
    Complaint,
    ComplaintDetail,
    NhomPhanAnh,
    PaginatedData,
    TrangThaiPhanAnh,
} from "@dts";
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

export interface FetchComplaintsParams {
    page?: number;
    limit?: number;
    status?: TrangThaiPhanAnh;
    category?: NhomPhanAnh;
    search?: string;
}

/**
 * Danh sach phan anh danh cho nhan vien (yeu cau quyen complaints.read).
 * Backend tu gioi han theo cum phu trach / trang thai chuyen UBND (xem
 * complaintScopeFilter trong quan-ly-to-dan-pho-hoa-binh-backend-app), nen
 * khong can loc pham vi them o client.
 */
export const fetchComplaints = (
    params: FetchComplaintsParams = {},
): Promise<PaginatedData<Complaint>> =>
    request<PaginatedData<Complaint>>("GET", API.COMPLAINTS, {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_PAGE_SIZE,
        status: params.status,
        category: params.category,
        search: params.search,
    });
