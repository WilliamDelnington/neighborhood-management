import React, { useEffect, useState } from "react";
import { Box, Tabs, Text, useSnackbar } from "zmp-ui";
import { PageLayout, AppBottomNav } from "@components/layout";
import {
    AdminGuard,
    LoadingState,
    EmptyState,
    ErrorState,
} from "@components/admin";
import { Button } from "@components/customized";
import { useStore } from "@store";
import {
    fetchPopulationReport,
    fetchComplaintReport,
    fetchPcccReport,
    fetchSecurityReport,
    fetchFinanceReport,
    downloadReportExcel,
} from "@service/reportApi";

/**
 * Bao cao theo cuoc hop / khao sat can id cu the (fetchMeetingReport, fetchSurveyReport)
 * nen khong dua vao danh sach tab tong quat nay - se duoc truy cap tu man hinh chi tiet
 * cuoc hop/khao sat tuong ung trong tuong lai.
 */
type ReportTabKey =
    | "population"
    | "complaints"
    | "pccc"
    | "security"
    | "finance";

type ReportTab = {
    key: ReportTabKey;
    label: string;
    fetch: () => Promise<unknown>;
    excelFileName: string;
};

const humanizeKey = (key: string) =>
    key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^./, c => c.toUpperCase());

const renderValue = (value: unknown, depth = 0): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
        return (
            <Text size="xSmall" className="text-text_2">
                —
            </Text>
        );
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return (
                <Text size="xSmall" className="text-text_2">
                    Không có dữ liệu
                </Text>
            );
        }
        return (
            <Box
                className="pl-2 border-l border-divider_01"
                style={{ width: "100%" }}
            >
                {value.map((item, idx) => (
                    <Box
                        key={idx}
                        mb={2}
                        pb={2}
                        className="border-b border-divider_01 last:border-0"
                    >
                        {renderValue(item, depth + 1)}
                    </Box>
                ))}
            </Box>
        );
    }

    if (typeof value === "object") {
        return (
            <Box style={{ width: "100%" }}>
                {Object.entries(value as Record<string, unknown>).map(
                    ([k, v]) => (
                        <Box
                            key={k}
                            flex
                            justifyContent="space-between"
                            alignItems="flex-start"
                            py={1}
                            className="border-b border-divider_01 last:border-0"
                            style={{ gap: 8 }}
                        >
                            <Text
                                size="xxSmall"
                                className="text-text_2"
                                style={{ flexShrink: 0 }}
                            >
                                {humanizeKey(k)}
                            </Text>
                            <Box style={{ textAlign: "right", flex: 1 }}>
                                {typeof v === "object" && v !== null ? (
                                    renderValue(v, depth + 1)
                                ) : (
                                    <Text size="xSmall">{String(v)}</Text>
                                )}
                            </Box>
                        </Box>
                    ),
                )}
            </Box>
        );
    }

    return <Text size="xSmall">{String(value)}</Text>;
};

const ReportsPage: React.FC = () => (
    <AdminGuard roles={["admin", "neighborhood_leader"]}>
        <PageLayout
            id="admin-reports"
            title="Báo cáo"
            bottomNav={<AppBottomNav />}
        >
            <ReportsContent />
        </PageLayout>
    </AdminGuard>
);

const ReportsContent: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const user = useStore(state => state.user);
    const isAdmin = !!user && user.roles.includes("admin");

    const tabs: ReportTab[] = [
        {
            key: "population",
            label: "Dân cư",
            fetch: fetchPopulationReport,
            excelFileName: "bao-cao-dan-cu.xlsx",
        },
        {
            key: "complaints",
            label: "Phản ánh",
            fetch: () => fetchComplaintReport(),
            excelFileName: "bao-cao-phan-anh.xlsx",
        },
        {
            key: "pccc",
            label: "PCCC",
            fetch: fetchPcccReport,
            excelFileName: "bao-cao-pccc.xlsx",
        },
        {
            key: "security",
            label: "An ninh",
            fetch: fetchSecurityReport,
            excelFileName: "bao-cao-an-ninh.xlsx",
        },
        ...(isAdmin
            ? [
                  {
                      key: "finance" as ReportTabKey,
                      label: "Tài chính",
                      fetch: () => fetchFinanceReport(),
                      excelFileName: "bao-cao-tai-chinh.xlsx",
                  },
              ]
            : []),
    ];

    const [activeKey, setActiveKey] = useState<ReportTabKey>("population");
    const [dataByTab, setDataByTab] = useState<
        Partial<Record<ReportTabKey, unknown>>
    >({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [exporting, setExporting] = useState(false);

    const activeTab = tabs.find(t => t.key === activeKey) || tabs[0];

    const load = (tab: ReportTab) => {
        setLoading(true);
        setError(false);
        tab.fetch()
            .then(res => setDataByTab(prev => ({ ...prev, [tab.key]: res })))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (activeTab) load(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey]);

    const handleExport = async () => {
        if (!activeTab) return;
        try {
            setExporting(true);
            await downloadReportExcel(activeTab.key, activeTab.excelFileName);
        } catch (err: any) {
            openSnackbar({
                type: "error",
                text: err?.message || "Không thể xuất báo cáo",
            });
        } finally {
            setExporting(false);
        }
    };

    const currentData = activeTab ? dataByTab[activeTab.key] : undefined;

    return (
        <Box p={4}>
            <Tabs
                activeKey={activeKey}
                onChange={key => setActiveKey(key as ReportTabKey)}
                scrollable
            >
                {tabs.map(tab => (
                    <Tabs.Tab key={tab.key} label={tab.label}>
                        <Box className="bg-white rounded-2xl p-4 shadow-sm mt-3">
                            <Box
                                flex
                                justifyContent="space-between"
                                alignItems="center"
                                mb={3}
                            >
                                <Text.Title size="small">
                                    {tab.label}
                                </Text.Title>
                                <Button
                                    size="small"
                                    variant="secondary"
                                    loading={exporting}
                                    onClick={handleExport}
                                >
                                    Xuất Excel
                                </Button>
                            </Box>

                            {loading && <LoadingState />}
                            {!loading && error && (
                                <ErrorState onRetry={() => load(tab)} />
                            )}
                            {!loading && !error && !currentData && (
                                <EmptyState label="Chưa có dữ liệu báo cáo" />
                            )}
                            {!loading && !error && currentData
                                ? renderValue(currentData)
                                : null}
                        </Box>
                    </Tabs.Tab>
                ))}
            </Tabs>
        </Box>
    );
};

export default ReportsPage;
