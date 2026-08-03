import { API } from "@constants/common";
import { request } from "./request";

interface NeighborhoodListResponse {
    items: { name: string }[];
}

// Backend tra ve danh sach phan trang cac to dan pho chinh thuc (xem
// neighborhoodService.listNeighborhoods o backend), khong phai mang chuoi tho
// nhu truoc - chi lay ten de dien vao NeighborhoodPickerSheet.
export const fetchNeighborhoods = async (): Promise<string[]> => {
    const res = await request<NeighborhoodListResponse>(
        "GET",
        API.NEIGHBORHOODS,
        { limit: 100, active: true },
    );
    return res.items.map(n => n.name);
};
