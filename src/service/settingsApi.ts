import { API } from "@constants/common";
import { request } from "./request";

export const fetchPublicSettings = (): Promise<Record<string, unknown>> =>
    request<Record<string, unknown>>("GET", API.SETTINGS, undefined, {
        useAuth: false,
    });
