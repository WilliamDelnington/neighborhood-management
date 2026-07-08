import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { MucNguyCoPccc, PaginatedData } from "@dts";
import { request } from "./request";

export type PcccCheck = {
    _id: string;
    householdId:
        | { _id: string; code: string; address: string; cluster: string }
        | string;
    hasFireExtinguisher: boolean;
    hasEmergencyExit: boolean;
    hasIndoorEvCharging: boolean;
    hasGasStoveOrStorageOrBusiness: boolean;
    isCrowdedRental: boolean;
    riskLevel: MucNguyCoPccc;
    remediationNeeded?: string;
    inspectionDate: string;
    inspectorId: { _id: string; displayName: string } | string;
    followUpStatus?: string;
    createdAt: string;
};

export interface ListPcccParams {
    page?: number;
    limit?: number;
    riskLevel?: MucNguyCoPccc;
    householdId?: string;
}

export const fetchPcccChecks = (
    params: ListPcccParams = {},
): Promise<PaginatedData<PcccCheck>> =>
    request<PaginatedData<PcccCheck>>("GET", API.PCCC, {
        page: params.page || 1,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        riskLevel: params.riskLevel,
        householdId: params.householdId,
    });

export const fetchPcccCheckById = (id: string): Promise<PcccCheck> =>
    request<PcccCheck>("GET", `${API.PCCC}/${id}`);

export interface PcccCheckInput {
    householdId: string;
    hasFireExtinguisher?: boolean;
    hasEmergencyExit?: boolean;
    hasIndoorEvCharging?: boolean;
    hasGasStoveOrStorageOrBusiness?: boolean;
    isCrowdedRental?: boolean;
    riskLevel?: MucNguyCoPccc;
    remediationNeeded?: string;
    inspectionDate: string;
    followUpStatus?: string;
}

export const createPcccCheck = (input: PcccCheckInput): Promise<PcccCheck> =>
    request<PcccCheck>("POST", API.PCCC, input);

export const updatePcccCheck = (
    id: string,
    input: Partial<PcccCheckInput>,
): Promise<PcccCheck> =>
    request<PcccCheck>("PATCH", `${API.PCCC}/${id}`, input);

export const deletePcccCheck = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.PCCC}/${id}`);

export const fetchPcccRiskSummary = (): Promise<Record<string, number>> =>
    request<Record<string, number>>("GET", `${API.PCCC}/summary`);
