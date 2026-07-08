import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
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

export interface MeetingInput {
    title: string;
    startTime: string;
    location: string;
    content: string;
    minutes?: string;
    attachments?: string[];
    published?: boolean;
}

export const createMeeting = (input: MeetingInput): Promise<Meeting> =>
    request<Meeting>("POST", API.MEETINGS, input);

export const updateMeeting = (
    id: string,
    input: Partial<MeetingInput>,
): Promise<Meeting> =>
    request<Meeting>("PATCH", `${API.MEETINGS}/${id}`, input);

export const deleteMeeting = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.MEETINGS}/${id}`);

export const registerMeeting = (
    id: string,
    answer: DangKyHop,
    delegateName?: string,
): Promise<unknown> =>
    request("POST", `${API.MEETINGS}/${id}/register`, { answer, delegateName });

export const fetchMeetingRegistrations = (
    id: string,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
): Promise<PaginatedData<unknown>> =>
    request<PaginatedData<unknown>>("GET", `${API.MEETINGS}/${id}/register`, {
        page,
        limit,
    });
