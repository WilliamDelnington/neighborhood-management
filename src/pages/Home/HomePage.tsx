import React, { useEffect, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import { HomeHeader, AppBottomNav, PageLayout } from "@components/layout";
import {
    HomeInfoBanner,
    EmergencyContactBox,
    ContactInfoBox,
    FeaturesCard,
} from "@components/home";
import { hasPermission } from "@components/role";
import {
    APP_UTINITIES,
    MORE_FEATURES,
    EMERGENCY_HOTLINES,
    MiniAppFeatureConfigEntry,
    resolveFeatureOrder,
} from "@constants/utinities";
import { fetchPublicAnnouncements } from "@service/announcementApi";
import { fetchPublicSettings } from "@service/settingsApi";
import {
    LOAI_THONG_BAO_LABEL,
    APP_NAME_DEFAULT,
    APP_NAME_HOUSE_OWNER,
} from "@constants/domain";
import { Announcement } from "@dts";
import { useStore } from "@store";

const HomePage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const user = useStore(state => state.user);
    const hasUnreadMeetingNotification = useStore(
        state => state.hasUnreadMeetingNotification,
    );
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [featureConfig, setFeatureConfig] = useState<
        MiniAppFeatureConfigEntry[] | undefined
    >(undefined);

    const appName =
        user?.primaryRole === "house_owner"
            ? APP_NAME_HOUSE_OWNER
            : APP_NAME_DEFAULT;

    const features = resolveFeatureOrder(
        [...APP_UTINITIES, ...MORE_FEATURES],
        featureConfig,
    )
        .filter(
            item =>
                !item.requiredPermission ||
                hasPermission(user, item.requiredPermission),
        )
        .map(item => ({
            ...item,
            showBadge:
                item.key === "meetings"
                    ? hasUnreadMeetingNotification
                    : undefined,
        }));

    useEffect(() => {
        fetchPublicAnnouncements(1, 3)
            .then(res => setAnnouncements(res.items))
            .catch(() => setAnnouncements([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchPublicSettings()
            .then(settings =>
                setFeatureConfig(
                    settings.mini_app_features as
                        | MiniAppFeatureConfigEntry[]
                        | undefined,
                ),
            )
            .catch(() => setFeatureConfig(undefined));
    }, []);

    return (
        <PageLayout
            id="home-page"
            customHeader={<HomeHeader title={appName} />}
            bottomNav={<AppBottomNav />}
        >
            <HomeInfoBanner
                title={appName}
                address="Phường Dương Nội, TP Hà Nội"
            />

            <FeaturesCard features={features} />

            <Box className="bg-white mt-2 p-4">
                <Box
                    flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Text.Title size="small">Thông báo mới nhất</Text.Title>
                    <Text
                        size="xSmall"
                        className="text-main"
                        onClick={() =>
                            navigate("/notifications", {
                                animate: true,
                                state: { tab: "announcements" },
                            })
                        }
                    >
                        Xem tất cả
                    </Text>
                </Box>

                {!loading && announcements.length === 0 && (
                    <Text size="xSmall" className="text-text_2">
                        Chưa có thông báo nào.
                    </Text>
                )}

                {announcements.map(item => (
                    <Box
                        key={item._id}
                        py={2}
                        className="border-b border-divider_01 last:border-0"
                        onClick={() =>
                            navigate(`/announcements/${item._id}`, {
                                animate: true,
                            })
                        }
                    >
                        <Text size="small" className="font-medium">
                            {item.pinned ? "📌 " : ""}
                            {item.title}
                        </Text>
                        <Text size="xxSmall" className="text-text_2">
                            {LOAI_THONG_BAO_LABEL[item.category]}
                        </Text>
                    </Box>
                ))}
            </Box>

            <EmergencyContactBox hotlines={EMERGENCY_HOTLINES} />

            <ContactInfoBox
                title="Thông tin liên hệ tổ dân phố"
                description="Tổ trưởng tổ dân phố, phường Dương Nội, TP Hà Nội"
            />
        </PageLayout>
    );
};

export default HomePage;
