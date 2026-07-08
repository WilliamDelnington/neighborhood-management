import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { PaginatedData } from "@dts";
import { request } from "./request";

export type FinanceTransaction = {
    _id: string;
    type: "thu" | "chi";
    partyName: string;
    amount: number;
    transactionDate: string;
    content: string;
    status: "nhap" | "da_duyet" | "da_huy";
    createdAt: string;
};

export interface ListFinanceParams {
    page?: number;
    limit?: number;
    type?: "thu" | "chi";
    status?: string;
    fromDate?: string;
    toDate?: string;
}

export const fetchFinanceTransactions = (
    params: ListFinanceParams = {},
): Promise<PaginatedData<FinanceTransaction>> =>
    request<PaginatedData<FinanceTransaction>>("GET", API.FINANCE, {
        page: params.page || 1,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        type: params.type,
        status: params.status,
        fromDate: params.fromDate,
        toDate: params.toDate,
    });

export interface FinanceTransactionInput {
    type: "thu" | "chi";
    partyName: string;
    amount: number;
    transactionDate: string;
    content: string;
    status?: "nhap" | "da_duyet" | "da_huy";
}

export const createFinanceTransaction = (
    input: FinanceTransactionInput,
): Promise<FinanceTransaction> =>
    request<FinanceTransaction>("POST", API.FINANCE, input);

export const updateFinanceTransaction = (
    id: string,
    input: Partial<FinanceTransactionInput>,
): Promise<FinanceTransaction> =>
    request<FinanceTransaction>("PATCH", `${API.FINANCE}/${id}`, input);

export const cancelFinanceTransaction = (
    id: string,
): Promise<FinanceTransaction> =>
    request<FinanceTransaction>("POST", `${API.FINANCE}/${id}/cancel`);

export const deleteFinanceTransaction = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.FINANCE}/${id}`);

export const fetchFinanceSummary = (
    fromDate?: string,
    toDate?: string,
): Promise<unknown> =>
    request("GET", `${API.FINANCE}/summary`, { fromDate, toDate });
