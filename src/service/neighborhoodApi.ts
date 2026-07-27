import { API } from "@constants/common";
import { request } from "./request";

export const fetchNeighborhoods = (): Promise<string[]> =>
    request<string[]>("GET", API.NEIGHBORHOODS);
