import type {
    BusinessDocumentStatus,
    BusinessStatus,
    DangKyHop,
    GioiTinh,
    HouseStatus,
    LoaiCauHoiKhaoSat,
    LoaiCuTru,
    LoaiSoHuu,
    LoaiThongBao,
    LoaiYeuCauHoTro,
    MucDoAnNinh,
    MucNguyCoPccc,
    NhomPhanAnh,
    Role,
    TrangThaiPhanAnh,
    TrangThaiYeuCauHoTro,
} from "@dts";

export const ROLE_LABEL: Record<Role, string> = {
    house_owner: "Chủ sở hữu",
    neighborhood_leader: "Tổ trưởng",
    secretary: "Bí thư",
    regional_police: "Công an khu vực",
    people_committee_official: "Cán bộ UBND",
    admin: "Quản trị viên",
};

/**
 * Ten hien thi cua ung dung tren man hinh chinh - doi theo vai tro dang nhap:
 * house_owner (quan ly nha/ho dan/nhan khau cua rieng minh) thay vi nhan vien/
 * admin (quan ly toan bo to dan pho). Dung khi chua dang nhap hoac vai tro
 * khac house_owner.
 */
export const APP_NAME_DEFAULT = "Quản lý tổ dân phố";
export const APP_NAME_HOUSE_OWNER = "Quản lý nhà số";

export const NHOM_PHAN_ANH_LABEL: Record<NhomPhanAnh, string> = {
    an_ninh_trat_tu: "An ninh trật tự",
    pccc: "PCCC",
    ve_sinh_moi_truong: "Vệ sinh môi trường",
    ha_tang_dien_nuoc: "Hạ tầng điện nước",
    chieu_sang: "Chiếu sáng",
    tranh_chap_dan_cu: "Tranh chấp dân cư",
    tam_tru_nha_cho_thue: "Tạm trú / nhà cho thuê",
    gop_y_chung: "Góp ý chung",
    khac: "Khác",
};

export const TRANG_THAI_PHAN_ANH_LABEL: Record<TrangThaiPhanAnh, string> = {
    moi_tiep_nhan: "Mới tiếp nhận",
    da_tiep_nhan: "Đã tiếp nhận",
    dang_xu_ly: "Đang xử lý",
    da_chuyen_ubnd: "Đã chuyển UBND phường",
    da_xu_ly: "Đã xử lý",
    dong: "Đóng",
};

export const TRANG_THAI_PHAN_ANH_TONE: Record<
    TrangThaiPhanAnh,
    "gray" | "blue" | "yellow" | "green" | "red"
> = {
    moi_tiep_nhan: "gray",
    da_tiep_nhan: "blue",
    dang_xu_ly: "yellow",
    da_chuyen_ubnd: "blue",
    da_xu_ly: "green",
    dong: "gray",
};

export const LOAI_YEU_CAU_HO_TRO_LABEL: Record<LoaiYeuCauHoTro, string> = {
    bao_loi: "Báo lỗi",
    gop_y: "Góp ý",
};

export const TRANG_THAI_YEU_CAU_HO_TRO_LABEL: Record<
    TrangThaiYeuCauHoTro,
    string
> = {
    moi: "Mới",
    dang_xu_ly: "Đang xử lý",
    da_xu_ly: "Đã xử lý",
    dong: "Đóng",
};

export const TRANG_THAI_YEU_CAU_HO_TRO_TONE: Record<
    TrangThaiYeuCauHoTro,
    "gray" | "blue" | "yellow" | "green" | "red"
> = {
    moi: "gray",
    dang_xu_ly: "yellow",
    da_xu_ly: "green",
    dong: "gray",
};

export const HOUSE_STATUS_LABEL: Record<HouseStatus, string> = {
    unverified: "Chưa xác thực",
    pending: "Chờ duyệt",
    verified: "Đã xác thực",
    denied: "Từ chối",
    locked: "Đã khóa",
};

export const HOUSE_STATUS_TONE: Record<
    HouseStatus,
    "gray" | "blue" | "yellow" | "green" | "red"
> = {
    unverified: "gray",
    pending: "yellow",
    verified: "green",
    denied: "red",
    locked: "gray",
};

// Trang thai xac thuc ho kinh doanh - tinh tu ket qua duyet tung giay to bat
// buoc (xem @dts BusinessStatus). Khac HouseStatus (khong con "pending"/
// "denied"/"locked" ma thay bang "pending_approval"/"need_supplement").
export const BUSINESS_STATUS_LABEL: Record<BusinessStatus, string> = {
    unverified: "Chưa xác thực",
    pending_approval: "Đang chờ duyệt",
    need_supplement: "Cần bổ sung hồ sơ",
    verified: "Đã xác thực",
};

export const BUSINESS_STATUS_TONE: Record<
    BusinessStatus,
    "gray" | "blue" | "yellow" | "green" | "red"
> = {
    unverified: "gray",
    pending_approval: "yellow",
    need_supplement: "red",
    verified: "green",
};

export const BUSINESS_DOCUMENT_STATUS_LABEL: Record<
    BusinessDocumentStatus,
    string
> = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Bị từ chối, cần bổ sung",
};

export const BUSINESS_DOCUMENT_STATUS_TONE: Record<
    BusinessDocumentStatus,
    "gray" | "blue" | "yellow" | "green" | "red"
> = {
    pending: "yellow",
    approved: "green",
    rejected: "red",
};

export const LOAI_SO_HUU_LABEL: Record<LoaiSoHuu, string> = {
    chinh_chu: "Chính chủ",
    cho_thue: "Cho thuê",
};

export const GIOI_TINH_LABEL: Record<GioiTinh, string> = {
    nam: "Nam",
    nu: "Nữ",
    khac: "Khác",
};

export const LOAI_CU_TRU_LABEL: Record<LoaiCuTru, string> = {
    thuong_tru: "Thường trú",
    tam_tru: "Tạm trú",
};

export const MUC_NGUY_CO_PCCC_LABEL: Record<MucNguyCoPccc, string> = {
    xanh: "Xanh",
    vang: "Vàng",
    do: "Đỏ",
};

export const MUC_DO_AN_NINH_LABEL: Record<MucDoAnNinh, string> = {
    binh_thuong: "Bình thường",
    can_theo_doi: "Cần theo dõi",
    khan_cap: "Khẩn cấp",
};

export const LOAI_THONG_BAO_LABEL: Record<LoaiThongBao, string> = {
    chung: "Thông báo chung",
    hop_dan: "Họp dân",
    pccc: "PCCC",
    ve_sinh_moi_truong: "Vệ sinh môi trường",
    an_ninh_trat_tu: "An ninh trật tự",
    khac: "Khác",
};

export const DANG_KY_HOP_LABEL: Record<DangKyHop, string> = {
    co: "Có",
    khong: "Không",
    uy_quyen: "Ủy quyền",
};

export const LOAI_CAU_HOI_KHAO_SAT_LABEL: Record<LoaiCauHoiKhaoSat, string> = {
    dong_y_khong_dong_y: "Đồng ý / Không đồng ý",
    chon_mot: "Chọn một",
    chon_nhieu: "Chọn nhiều",
    y_kien_khac: "Ý kiến khác",
};
