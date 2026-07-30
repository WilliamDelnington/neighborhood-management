import React from "react";
import { useLocation } from "react-router-dom";
import { BottomNavigation, Icon } from "zmp-ui";
import { useStore } from "@store";
import { hasPermission } from "@components/role";

/**
 * Thanh dieu huong duoi cung, thay the sidebar desktop. Muc "Danh muc" (nha so /
 * ho dan / nhan khau) chi hien khi tai khoan duoc cap it nhat mot trong cac
 * quyen doc tuong ung - moi quyen duoc admin cau hinh rieng theo vai tro (xem
 * trang Vai tro & phan quyen), khong con gan voi "dashboard.read" nhu truoc.
 * Muc "Phan anh" luon hien voi moi tai khoan (nguoi dan gui/tra cuu, nhan vien
 * co them hop thu xem phan anh trong pham vi phu trach - xem ComplaintLookupPage).
 */
const AppBottomNav: React.FC = () => {
    const { pathname } = useLocation();
    const user = useStore(state => state.user);
    const canViewSections =
        hasPermission(user, "houses.read") ||
        hasPermission(user, "households.read") ||
        hasPermission(user, "citizens.read") ||
        hasPermission(user, "businesses.read") ||
        hasPermission(user, "business_types.read");

    const activeKey = (() => {
        if (pathname === "/") return "home";
        if (pathname.startsWith("/announcements")) return "announcements";
        if (pathname.startsWith("/admin")) return "admin";
        if (pathname.startsWith("/complaints")) return "complaints";
        if (pathname.startsWith("/account")) return "account";
        return "home";
    })();

    return (
        <BottomNavigation id="app-bottom-nav" activeKey={activeKey} fixed>
            <BottomNavigation.Item
                key="home"
                itemKey="home"
                label="Trang chủ"
                icon={<Icon icon="zi-home" />}
                linkTo="/"
            />
            <BottomNavigation.Item
                key="announcements"
                itemKey="announcements"
                label="Thông báo"
                icon={<Icon icon="zi-notif" />}
                linkTo="/announcements"
            />
            {canViewSections && (
                <BottomNavigation.Item
                    key="admin"
                    itemKey="admin"
                    label="Danh mục"
                    icon={<Icon icon="zi-setting" />}
                    linkTo="/admin"
                />
            )}
            <BottomNavigation.Item
                key="complaints"
                itemKey="complaints"
                label="Phản ánh"
                icon={<Icon icon="zi-note" />}
                linkTo="/complaints/lookup"
            />
            <BottomNavigation.Item
                key="account"
                itemKey="account"
                label="Tài khoản"
                icon={<Icon icon="zi-user" />}
                linkTo="/account"
            />
        </BottomNavigation>
    );
};

export default AppBottomNav;
