import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { LoaiYeuCauHoTro, PaginatedData, SupportTicket } from "@dts";
import { request } from "./request";

export interface CreateSupportTicketParams {
    type: LoaiYeuCauHoTro;
    title: string;
    content: string;
    images?: string[];
    deviceInfo?: string;
}

export const createSupportTicket = (
    params: CreateSupportTicketParams,
): Promise<SupportTicket> =>
    request<SupportTicket>("POST", API.SUPPORT_TICKETS, params);

export const fetchMySupportTickets = (
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
): Promise<PaginatedData<SupportTicket>> =>
    request<PaginatedData<SupportTicket>>("GET", API.SUPPORT_TICKETS_MINE, {
        page,
        limit,
    });

export const fetchSupportTicketDetail = (id: string): Promise<SupportTicket> =>
    request<SupportTicket>("GET", `${API.SUPPORT_TICKETS}/${id}`);
