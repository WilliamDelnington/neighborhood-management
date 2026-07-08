import React, { useEffect, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    StatCard,
    LoadingState,
    ErrorState,
} from "@components/admin";
import { STAFF_ROLES } from "@components/role";
import { useStore } from "@store";
import { DashboardSummary, fetchDashboardSummary } from "@service/dashboardApi";
import { ROLE_LABEL } from "@constants/domain";
import { Role } from "@dts";

type ModuleItem = {
    key: string;
    label: string;
    path: string;
    roles: Role[];
};

const MODULES: ModuleItem[] = [
    {
        key: "households",
        label: "Hộ dân",
        path: "/admin/households",
        roles: [
            "admin",
            "neighborhood_leader",
            "secretary",
            "regional_police",
            "people_committee_official",
        ],
    },
    {
        key: "citizens",
        label: "Nhân khẩu",
        path: "/admin/citizens",
        roles: [
            "admin",
            "neighborhood_leader",
            "secretary",
            "regional_police",
            "people_committee_official",
        ],
    },
    {
        key: "complaints",
        label: "Phản ánh",
        path: "/admin/complaints",
        roles: [
            "admin",
            "neighborhood_leader",
            "regional_police",
            "people_committee_official",
        ],
    },
    {
        key: "pccc",
        label: "PCCC",
        path: "/admin/pccc",
        roles: [
            "admin",
            "neighborhood_leader",
            "regional_police",
            "people_committee_official",
        ],
    },
    {
        key: "security",
        label: "An ninh, tạm trú",
        path: "/admin/security",
        roles: [
            "admin",
            "neighborhood_leader",
            "regional_police",
            "people_committee_official",
        ],
    },
    {
        key: "meetings",
        label: "Cuộc họp",
        path: "/admin/meetings",
        roles: ["admin", "secretary", "neighborhood_leader"],
    },
    {
        key: "announcements",
        label: "Thông báo",
        path: "/admin/announcements",
        roles: ["admin", "secretary", "neighborhood_leader"],
    },
    {
        key: "surveys",
        label: "Khảo sát",
        path: "/admin/surveys",
        roles: ["admin", "secretary"],
    },
    {
        key: "finance",
        label: "Tài chính",
        path: "/admin/finance",
        roles: ["admin"],
    },
    {
        key: "reports",
        label: "Báo cáo",
        path: "/admin/reports",
        roles: ["admin", "neighborhood_leader"],
    },
    {
        key: "users",
        label: "Người dùng & vai trò",
        path: "/admin/users",
        roles: ["admin"],
    },
    {
        key: "settings",
        label: "Cài đặt",
        path: "/admin/settings",
        roles: ["admin"],
    },
];

const AdminDashboardPage: React.FC = () => (
    <AdminGuard roles={[...STAFF_ROLES]}>
        <AdminDashboardContent />
    </AdminGuard>
);

const AdminDashboardContent: React.FC = () => {
    const navigate = useNavigate();
    const user = useStore(state => state.user);
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchDashboardSummary()
            .then(setSummary)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const visibleModules = MODULES.filter(
        m => user && m.roles.some(r => user.roles.includes(r)),
    );

    return (
        <PageLayout
            id="admin-dashboard"
            title="Bảng điều khiển"
            bottomNav={<AppBottomNav />}
        >
            <Box p={4}>
                <Text.Title size="small">
                    Xin chào, {user?.displayName} (
                    {user ? ROLE_LABEL[user.primaryRole] : ""})
                </Text.Title>

                {loading && <LoadingState />}
                {!loading && error && <ErrorState onRetry={load} />}

                {!loading && !error && summary && (
                    <Box flex flexWrap mt={3} style={{ gap: 12 }}>
                        <StatCard
                            label="Tổng hộ dân"
                            value={summary.totalHouseholds}
                        />
                        <StatCard
                            label="Tổng nhân khẩu"
                            value={summary.totalCitizens}
                        />
                        <StatCard
                            label="Nhà cho thuê"
                            value={summary.rentalHouseholds}
                        />
                        <StatCard
                            label="Hộ cần hỗ trợ"
                            value={summary.householdsNeedingSupport}
                            tone="warning"
                        />
                        <StatCard
                            label="Phản ánh mới"
                            value={summary.newComplaints}
                            tone="danger"
                        />
                        <StatCard
                            label="Đang xử lý"
                            value={summary.inProgressComplaints}
                            tone="warning"
                        />
                        <StatCard
                            label="Nguy cơ PCCC cao"
                            value={summary.highRiskPcccCount}
                            tone="danger"
                        />
                        <StatCard
                            label="Thu - Chi tháng"
                            value={`${(
                                summary.financeSummary.monthNet / 1000
                            ).toFixed(0)}k`}
                            tone={
                                summary.financeSummary.monthNet >= 0
                                    ? "success"
                                    : "danger"
                            }
                        />
                    </Box>
                )}

                {!loading && !error && summary && summary.taskList.length > 0 && (
                    <Box className="bg-white rounded-2xl p-3 mt-3 shadow-sm">
                        <Text.Title size="small" className="mb-2">
                            Việc cần xử lý
                        </Text.Title>
                        {summary.taskList.map(task => (
                            <Box
                                key={task.label}
                                flex
                                justifyContent="space-between"
                                py={2}
                                className="border-b border-divider_01 last:border-0"
                                onClick={() =>
                                    task.link &&
                                    navigate(task.link, { animate: true })
                                }
                            >
                                <Text size="xSmall">{task.label}</Text>
                                <Text
                                    size="xSmall"
                                    className="text-main font-medium"
                                >
                                    {task.count}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                )}

                <Text.Title size="small" className="mt-4 mb-2">
                    Nghiệp vụ
                </Text.Title>
                <Box flex flexWrap style={{ gap: 10 }}>
                    {visibleModules.map(m => (
                        <Box
                            key={m.key}
                            className="bg-white rounded-2xl shadow-sm"
                            style={{ width: "calc(50% - 5px)", padding: 14 }}
                            onClick={() => navigate(m.path, { animate: true })}
                        >
                            <Text size="small" className="font-medium">
                                {m.label}
                            </Text>
                        </Box>
                    ))}
                </Box>
            </Box>
        </PageLayout>
    );
};

export default AdminDashboardPage;
