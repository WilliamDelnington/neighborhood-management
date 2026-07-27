import { API, DEFAULT_PAGE_SIZE } from "@constants/common";
import { Announcement, PaginatedData } from "@dts";
import { request } from "./request";

export const fetchPublicAnnouncements = (
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
): Promise<PaginatedData<Announcement>> =>
    request<PaginatedData<Announcement>>(
        "GET",
        API.ANNOUNCEMENTS,
        { page, limit },
        { useAuth: false },
    );

export const fetchAnnouncementDetail = (id: string): Promise<Announcement> =>
    request<Announcement>("GET", `${API.ANNOUNCEMENTS}/${id}`, undefined, {
        useAuth: false,
    });
