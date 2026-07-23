import type { FC } from "react";

export type ApiResponse<T = unknown> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export type PaginatedData<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type AppError = {
    status?: number;
    message: string;
};

// ---------------------------------------------------------------------------
// Nguoi dung / vai tro
// ---------------------------------------------------------------------------
export type Role =
    | "resident"
    | "neighborhood_leader"
    | "secretary"
    | "regional_police"
    | "people_committee_official"
    | "admin";

export type UserStatus = "active" | "pending" | "locked";

export type User = {
    id: string;
    zaloUserId?: string;
    displayName: string;
    avatarUrl?: string;
    phone?: string;
    email?: string;
    address?: string;
    roles: Role[];
    primaryRole: Role;
    permissions: string[];
    status: UserStatus;
    householdId?: string;
    citizenId?: string;
    assignedClusters: string[];
    notificationPermission: boolean;
    createdAt?: string;
};

// ---------------------------------------------------------------------------
// Ho dan / nhan khau
// ---------------------------------------------------------------------------
export type LoaiSoHuu = "chinh_chu" | "cho_thue";
export type GioiTinh = "nam" | "nu" | "khac";
export type LoaiCuTru = "thuong_tru" | "tam_tru";

export type HouseStatus =
    | "unverified"
    | "pending"
    | "verified"
    | "denied"
    | "locked";

export type House = {
    _id: string;
    code: string;
    cluster: string;
    address: string;
    status: HouseStatus;
    ownerId?: string | { _id: string; displayName: string };
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export type Household = {
    _id: string;
    code: string;
    cluster: string;
    address: string;
    headOfHousehold: string;
    phone?: string;
    memberCount: number;
    ownershipType: LoaiSoHuu;
    needsSupport: boolean;
    houseId?: string | House;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export type BusinessType = {
    _id: string;
    name: string;
    description?: string;
    active: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
};

export type Business = {
    _id: string;
    name: string;
    houseId: string | House;
    cluster: string;
    businessType?: string | BusinessType;
    ownerName?: string;
    phone?: string;
    active: boolean;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export type Citizen = {
    _id: string;
    fullName: string;
    phone?: string;
    cccd?: string;
    birthDate?: string;
    gender: GioiTinh;
    relationToHead?: string;
    householdId: string | Household;
    residenceType: LoaiCuTru;
    isElderly: boolean;
    isChild: boolean;
    isDisabledOrSupportNeeded: boolean;
    isPartyMember: boolean;
    isUnionMember: boolean;
    createdAt: string;
    updatedAt: string;
};

// ---------------------------------------------------------------------------
// Phan anh kien nghi
// ---------------------------------------------------------------------------
export type NhomPhanAnh =
    | "an_ninh_trat_tu"
    | "pccc"
    | "ve_sinh_moi_truong"
    | "ha_tang_dien_nuoc"
    | "chieu_sang"
    | "tranh_chap_dan_cu"
    | "tam_tru_nha_cho_thue"
    | "gop_y_chung"
    | "khac";

export type TrangThaiPhanAnh =
    | "moi_tiep_nhan"
    | "da_tiep_nhan"
    | "dang_xu_ly"
    | "da_chuyen_ubnd"
    | "da_xu_ly"
    | "dong";

export type Complaint = {
    _id: string;
    code: string;
    category: NhomPhanAnh;
    title: string;
    content: string;
    area?: string;
    images: string[];
    status: TrangThaiPhanAnh;
    createdByUserId:
        | string
        | { _id: string; displayName: string; phone?: string };
    assigneeId?: string | { _id: string; displayName: string };
    expectedCompletionDate?: string;
    actualCompletionDate?: string;
    escalatedToCommittee: boolean;
    internalNotes?: string;
    createdAt: string;
    updatedAt: string;
};

export type ComplaintTimelineEntry = {
    _id: string;
    complaintId: string;
    status: TrangThaiPhanAnh;
    note?: string;
    isPublic: boolean;
    actorId: string;
    createdAt: string;
};

export type ComplaintDetail = {
    complaint: Complaint;
    timeline: ComplaintTimelineEntry[];
};

// ---------------------------------------------------------------------------
// Thong bao / cuoc hop / khao sat (mo rong khi cac module lien quan hoan tat)
// ---------------------------------------------------------------------------
export type LoaiThongBao =
    | "chung"
    | "hop_dan"
    | "pccc"
    | "ve_sinh_moi_truong"
    | "an_ninh_trat_tu"
    | "khac";

export type Announcement = {
    _id: string;
    title: string;
    content: string;
    category: LoaiThongBao;
    status: "nhap" | "da_dang";
    priority: boolean;
    pinned: boolean;
    publishedAt?: string;
    createdAt: string;
};

export type DangKyHop = "co" | "khong" | "uy_quyen";

export type Meeting = {
    _id: string;
    title: string;
    startTime: string;
    location: string;
    content: string;
    minutes?: string;
    attachments: string[];
    published: boolean;
    createdAt: string;
};

export type LoaiCauHoiKhaoSat =
    | "dong_y_khong_dong_y"
    | "chon_mot"
    | "chon_nhieu"
    | "y_kien_khac";

export type SurveyQuestion = {
    _id: string;
    question: string;
    type: LoaiCauHoiKhaoSat;
    options: string[];
    required: boolean;
};

export type Survey = {
    _id: string;
    title: string;
    description?: string;
    questions: SurveyQuestion[];
    status: "nhap" | "dang_mo" | "da_dong";
    openDate?: string;
    closeDate?: string;
    createdAt: string;
};

export type MucNguyCoPccc = "xanh" | "vang" | "do";
export type MucDoAnNinh = "binh_thuong" | "can_theo_doi" | "khan_cap";

export type FileAsset = {
    _id: string;
    name: string;
    description?: string;
    url: string;
    category: "form" | "attachment" | "minutes" | "other";
    isPublic: boolean;
    createdAt: string;
};

export type AppNotification = {
    deliveryId: string;
    notification: {
        _id: string;
        title: string;
        body: string;
        type: string;
        relatedModel?: string;
        relatedId?: string;
        createdAt: string;
    };
    readAt?: string;
    sentAt?: string;
};

export type Utinity = {
    key: string;
    label: string;
    icon?: FC<any>;
    iconSrc?: string;
    color?: string;
    bgColor?: string;
    path?: string;
    link?: string;
    inDevelopment?: boolean;
    phoneNumber?: string;
    requiredPermission?: string;
    showBadge?: boolean;
};
