import React from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import { ListRow } from "@components/admin";
import { RequireAuth, hasPermission } from "@components/role";
import { useStore } from "@store";
import { ADMIN_APP_URL } from "@constants/common";
import { openWebView } from "@service/zalo";

const AdminHomePage: React.FC = () => (
    <RequireAuth>
        <AdminHomeContent />
    </RequireAuth>
);

const AdminHomeContent: React.FC = () => {
    const navigate = useNavigate();
    const user = useStore(state => state.user);
    const isResident = user?.primaryRole === "resident";

    const canViewHouseholds = hasPermission(user, "households.read");
    const canViewCitizens = hasPermission(user, "citizens.read");
    const canViewHouses = hasPermission(user, "houses.read");
    const canViewBusinessTypes = hasPermission(user, "business_types.read");

    return (
        <PageLayout
            id="admin-home-page"
            title="Quản trị"
            bottomNav={<AppBottomNav />}
        >
            <Box className="bg-white mt-2">
                {(canViewHouseholds ||
                    canViewCitizens ||
                    canViewHouses ||
                    canViewBusinessTypes) && (
                    <Box px={4}>
                        {canViewHouses && (
                            <ListRow
                                title="Danh sách nhà số"
                                subtitle={
                                    isResident
                                        ? "Nhà số của bạn"
                                        : "Nhà số trong cụm dân cư bạn phụ trách"
                                }
                                onClick={() =>
                                    navigate("/admin/houses", {
                                        animate: true,
                                    })
                                }
                            />
                        )}
                        {canViewHouseholds && (
                            <ListRow
                                title="Danh sách hộ dân"
                                subtitle={
                                    isResident
                                        ? "Hộ dân trong nhà của bạn"
                                        : "Thông tin các hộ dân trong tổ dân phố"
                                }
                                onClick={() =>
                                    navigate("/admin/households", {
                                        animate: true,
                                    })
                                }
                            />
                        )}
                        {canViewCitizens && (
                            <ListRow
                                title="Danh sách nhân khẩu"
                                subtitle={
                                    isResident
                                        ? "Nhân khẩu trong hộ của bạn"
                                        : "Thông tin nhân khẩu của từng hộ"
                                }
                                onClick={() =>
                                    navigate("/admin/citizens", {
                                        animate: true,
                                    })
                                }
                            />
                        )}
                        {canViewBusinessTypes && (
                            <ListRow
                                title="Danh sách loại hình kinh doanh"
                                subtitle="Danh mục loại hình hộ kinh doanh"
                                onClick={() =>
                                    navigate("/admin/business-types", {
                                        animate: true,
                                    })
                                }
                            />
                        )}
                    </Box>
                )}
                {!canViewHouseholds &&
                    !canViewCitizens &&
                    !canViewHouses &&
                    !canViewBusinessTypes && (
                        <Box p={6}>
                            <Text
                                size="small"
                                className="text-text_2 text-center"
                            >
                                Tài khoản của bạn chưa được cấp quyền quản trị
                                nào.
                            </Text>
                        </Box>
                    )}
            </Box>

            {!!ADMIN_APP_URL && (
                <Box p={4}>
                    <Text
                        size="xSmall"
                        className="text-main text-center"
                        onClick={() => openWebView(ADMIN_APP_URL)}
                    >
                        Mở trang quản trị đầy đủ trên web
                    </Text>
                </Box>
            )}
        </PageLayout>
    );
};

export default AdminHomePage;
