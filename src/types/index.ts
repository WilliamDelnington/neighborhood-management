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
    | "house_owner"
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

// Trang thai xac thuc dung chung cho House/Household/Business - ba thuc the
// nay co trang thai xac thuc DOC LAP voi nhau (chi phu thuoc nhau mot chieu
// qua cascade khi House chuyen sang "verified"), nhung dung chung mot bo 5 gia
// tri nhu HouseStatus. Household/Business dung alias nay cho truong `status`
// cua chung thay vi mot enum rieng.
export type VerificationStatus = HouseStatus;

// Tinh trang cong trinh thuc te - doc lap voi HouseStatus (trang thai ho
// so/xac thuc). Optional: nha chua duoc khai se khong co gia tri nay.
export type HousePhysicalStatus =
    | "not_handed_over"
    | "not_renovated"
    | "under_construction"
    | "under_renovation"
    | "completed"
    | "in_use"
    | "vacant"
    | "damaged";

// Nha so co the thuoc ca nhan hoac to chuc - xem Organization ben duoi.
export type OwnerType = "user" | "organization";

export type Street = {
    _id: string;
    name: string;
    code: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

// To dan pho la thuoc tinh rieng cua nha so, KHONG suy ra tu Street (mot
// duong/pho co the chay qua nhieu to dan pho) - xem models/HouseRecord.ts o
// backend.
export type Neighborhood = {
    _id: string;
    name: string;
    code: string;
    sequence: number;
    active: boolean;
    address?: string;
    description?: string;
    contactPhone?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};

// Muc dich su dung nha do chu nha tu khai bao (co the nhieu gia tri dong
// thoi) - xem models/HouseRecord.ts o backend. Doc lap voi HouseUsageUnit
// (lop gan don vi cho tung Household/Business/Company DA TON TAI, chua co o
// app nay) - truong nay chi la "y dinh" khai bao, dung de nhac nho khai bao
// thieu (xem HouseDetailPage.tsx).
export const HOUSE_USAGE_TYPE = ["household", "business", "company"] as const;
export type HouseUsageType = typeof HOUSE_USAGE_TYPE[number];

export type House = {
    _id: string;
    code: string;
    cluster: string;
    // streetId/neighborhoodId duoc backend populate voi "name code" luc doc
    // (xem HOUSE_RECORD_POPULATE), van la id tho luc chi vua tao/cap nhat.
    streetId?: string | Street | null;
    neighborhoodId?: string | Neighborhood | null;
    address: string;
    status: HouseStatus;
    physicalStatus?: HousePhysicalStatus;
    usageTypes: HouseUsageType[];
    otherUsageNote?: string;
    // Cache cua quan he primary_owner dang active trong HouseOwnership (xem
    // ben duoi) - mot nha co the co nhieu chu so huu/nguoi quan ly dong thoi,
    // hai truong nay chi phan anh chu so huu CHINH hien tai.
    ownerType?: OwnerType;
    // ownerId khong duoc backend populate (van la id tho) - khi ownerType la
    // "organization", frontend tu goi fetchOrganizationById de biet
    // representativeUserId (xem HouseDetailPage.tsx).
    ownerId?: string | { _id: string; displayName: string };
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export type HouseOwnershipRelationshipType =
    | "primary_owner"
    | "co_owner"
    | "authorized_manager"
    | "legal_representative"
    | "contact_person";

export type HouseOwnershipVerificationStatus =
    | "waiting_verification"
    | "verified"
    | "rejected";

// ownerId luon la id tho (khong duoc backend populate, vi la ref da hinh User/
// Organization) - ownerDisplayName/ownerPhone duoc backend tu resolve rieng
// (xem houseOwnershipService.listHouseOwnerships) de khong phai goi them API
// ma house_owner thuong khong co quyen goi (vd tim User theo id).
export type HouseOwnership = {
    _id: string;
    houseId: string;
    ownerType: OwnerType;
    ownerId: string;
    ownerDisplayName?: string;
    ownerPhone?: string;
    relationshipType: HouseOwnershipRelationshipType;
    startDate: string;
    endDate?: string | null;
    active: boolean;
    verificationStatus: HouseOwnershipVerificationStatus;
    reason?: string;
    createdAt: string;
    updatedAt: string;
};

export type OrganizationType =
    | "cong_ty"
    | "hop_tac_xa"
    | "co_quan_nha_nuoc"
    | "khac";

export type Organization = {
    _id: string;
    name: string;
    taxCode?: string;
    organizationType: OrganizationType;
    representativeUserId:
        | string
        | { _id: string; displayName: string; phone?: string };
    representativeRole?: string;
    phone?: string;
    email?: string;
    address?: string;
    active: boolean;
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
    status: VerificationStatus;
    approvalNote?: string;
    denialReason?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export type DocumentType = {
    _id: string;
    name: string;
    code: string;
    description?: string;
    hasIssueDate: boolean;
    hasExpiryDate: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export type BusinessTypeDocumentRule = {
    _id?: string;
    documentTypeId: string | DocumentType;
    isRequired: boolean;
    warningBeforeDays?: number;
    // Rong = fallback ve permission "businesses.verify" khi duyet giay to nay.
    reviewerRoles: string[];
};

export type BusinessType = {
    _id: string;
    name: string;
    description?: string;
    active: boolean;
    sortOrder: number;
    requiredDocuments: BusinessTypeDocumentRule[];
    createdAt: string;
    updatedAt: string;
};

export type BusinessDocumentStatus = "pending" | "approved" | "rejected";

export type Business = {
    _id: string;
    name: string;
    houseId: string | House;
    cluster: string;
    businessType?: string | BusinessType;
    ownerName?: string;
    phone?: string;
    active: boolean;
    status: VerificationStatus;
    approvalNote?: string;
    denialReason?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

// Mirror cua Business nhung khong co businessType/quy trinh giay to rieng -
// xem models/Company.ts o backend.
export type Company = {
    _id: string;
    name: string;
    houseId: string | House;
    cluster: string;
    ownerName?: string;
    phone?: string;
    active: boolean;
    status: VerificationStatus;
    approvalNote?: string;
    denialReason?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

type PopulatedFileAssetSummary = {
    _id: string;
    name: string;
    url: string;
    mimeType?: string;
    sizeBytes?: number;
};
type PopulatedActor = { _id: string; displayName: string };

export type BusinessDocument = {
    _id: string;
    businessId: string;
    documentTypeId: string | DocumentType;
    fileAssetId: string | PopulatedFileAssetSummary;
    docNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    status: BusinessDocumentStatus;
    rejectionReason?: string;
    uploadedBy: string | PopulatedActor;
    reviewedBy?: string | PopulatedActor;
    reviewedAt?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export type RequiredDocumentItem = {
    rule: BusinessTypeDocumentRule;
    activeDocument: BusinessDocument | null;
    history: BusinessDocument[];
    missing: boolean;
    expired: boolean;
};

export type RequiredDocumentsResult = {
    business: Business;
    items: RequiredDocumentItem[];
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
// Ho tro (Ho so ca nhan)
// ---------------------------------------------------------------------------
export type LoaiYeuCauHoTro = "bao_loi" | "gop_y";

export type TrangThaiYeuCauHoTro = "moi" | "dang_xu_ly" | "da_xu_ly" | "dong";

export type SupportTicket = {
    _id: string;
    code: string;
    type: LoaiYeuCauHoTro;
    title: string;
    content: string;
    images: string[];
    deviceInfo?: string;
    status: TrangThaiYeuCauHoTro;
    createdByUserId:
        | string
        | { _id: string; displayName: string; phone?: string };
    adminResponse?: string;
    respondedByUserId?: string | { _id: string; displayName: string };
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
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
