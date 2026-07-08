import { API } from "@constants/common";
import { request } from "./request";

export type DashboardSummary = {
    totalHouseholds: number;
    totalCitizens: number;
    rentalHouseholds: number;
    householdsNeedingSupport: number;
    newComplaints: number;
    inProgressComplaints: number;
    highRiskPcccCount: number;
    upcomingMeetings: {
        id: string;
        title: string;
        startTime: string;
        location: string;
    }[];
    financeSummary: {
        monthIncome: number;
        monthExpense: number;
        monthNet: number;
        allTimeNet: number;
    };
    surveyParticipation: { openSurveys: number; totalResponses: number };
    taskList: { label: string; count: number; link?: string }[];
};

export const fetchDashboardSummary = (): Promise<DashboardSummary> =>
    request<DashboardSummary>("GET", `${API.REPORTS}/dashboard`);
