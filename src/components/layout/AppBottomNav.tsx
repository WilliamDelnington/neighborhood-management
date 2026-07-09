import React from "react";
import { useLocation } from "react-router-dom";
import { BottomNavigation, Icon } from "zmp-ui";
import { useStore } from "@store";
import { STAFF_ROLES } from "@components/role";

/**
 * Thanh dieu huong duoi cung, thay the sidebar desktop. Nguoi dan thay 4 muc co ban;
 * can bo/quan tri co them muc "Quan tri" dan vao khu vuc nghiep vu rieng.
 */
const AppBottomNav: React.FC = () => {
    const { pathname } = useLocation();
    const user = useStore(state => state.user);
    const isStaff =
        !!user &&
        user.roles.some(r => (STAFF_ROLES as readonly string[]).includes(r));

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
            {isStaff ? (
                <BottomNavigation.Item
                    key="admin"
                    itemKey="admin"
                    label="Quản trị"
                    icon={<Icon icon="zi-setting" />}
                    linkTo="/admin"
                />
            ) : (
                <BottomNavigation.Item
                    key="complaints"
                    itemKey="complaints"
                    label="Phản ánh"
                    icon={<Icon icon="zi-note" />}
                    linkTo="/complaints/lookup"
                />
            )}
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
