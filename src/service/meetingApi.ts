import { API } from "@constants/common";
import { DangKyHop, Meeting, PaginatedData } from "@dts";
import { request } from "./request";

export const fetchMeetings = (
    upcomingOnly = false,
): Promise<PaginatedData<Meeting>> =>
    request<PaginatedData<Meeting>>(
        "GET",
        API.MEETINGS,
        { upcomingOnly: upcomingOnly ? 1 : undefined },
        { useAuth: false },
    );

export const fetchMeetingDetail = (id: string): Promise<Meeting> =>
    request<Meeting>("GET", `${API.MEETINGS}/${id}`, undefined, {
        useAuth: false,
    });

export const registerMeeting = (
    id: string,
    answer: DangKyHop,
    delegateName?: string,
): Promise<unknown> =>
    request("POST", `${API.MEETINGS}/${id}/register`, { answer, delegateName });
