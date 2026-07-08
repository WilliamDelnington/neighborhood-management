import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import { HomePage } from "./Home";
import { LoginPage } from "./Login";
import { AccountPage } from "./Account";
import { EmergencyPage } from "./Emergency";
import {
    ComplaintCreatePage,
    ComplaintLookupPage,
    ComplaintDetailPage,
} from "./Complaints";
import { AnnouncementListPage, AnnouncementDetailPage } from "./Announcements";
import { NotificationsPage } from "./Notifications";
import { MeetingListPage, MeetingDetailPage } from "./Meetings";
import { SurveyListPage, SurveyDetailPage } from "./Surveys";
import { FilesPage } from "./Files";

import { AdminDashboardPage } from "./Admin/Dashboard";
import { HouseholdListPage, HouseholdDetailPage } from "./Admin/Households";
import { CitizenListPage } from "./Admin/Citizens";
import {
    ComplaintAdminListPage,
    ComplaintAdminDetailPage,
} from "./Admin/Complaints";
import { PcccListPage } from "./Admin/Pccc";
import { SecurityListPage } from "./Admin/Security";
import { MeetingAdminListPage, MeetingFormPage } from "./Admin/Meetings";
import {
    AnnouncementAdminListPage,
    AnnouncementFormPage,
} from "./Admin/Announcements";
import {
    SurveyAdminListPage,
    SurveyFormPage,
    SurveyResultsPage,
} from "./Admin/Surveys";
import { FinanceListPage } from "./Admin/Finance";
import { ReportsPage } from "./Admin/Reports";
import { SettingsPage } from "./Admin/Settings";
import { UserListPage } from "./Admin/Users";

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />

            <Route
                path="/complaints/create"
                element={<ComplaintCreatePage />}
            />
            <Route
                path="/complaints/lookup"
                element={<ComplaintLookupPage />}
            />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />

            <Route path="/announcements" element={<AnnouncementListPage />} />
            <Route
                path="/announcements/:id"
                element={<AnnouncementDetailPage />}
            />

            <Route path="/meetings" element={<MeetingListPage />} />
            <Route path="/meetings/:id" element={<MeetingDetailPage />} />

            <Route path="/surveys" element={<SurveyListPage />} />
            <Route path="/surveys/:id" element={<SurveyDetailPage />} />

            <Route path="/files" element={<FilesPage />} />

            {/* Khu vuc quan tri / nghiep vu - chi hien thi cho cac vai tro can bo, xem RequireRole trong tung trang */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/households" element={<HouseholdListPage />} />
            <Route
                path="/admin/households/:id"
                element={<HouseholdDetailPage />}
            />
            <Route path="/admin/citizens" element={<CitizenListPage />} />
            <Route
                path="/admin/complaints"
                element={<ComplaintAdminListPage />}
            />
            <Route
                path="/admin/complaints/:id"
                element={<ComplaintAdminDetailPage />}
            />
            <Route path="/admin/pccc" element={<PcccListPage />} />
            <Route path="/admin/security" element={<SecurityListPage />} />
            <Route path="/admin/meetings" element={<MeetingAdminListPage />} />
            <Route
                path="/admin/meetings/create"
                element={<MeetingFormPage />}
            />
            <Route
                path="/admin/meetings/:id/edit"
                element={<MeetingFormPage />}
            />
            <Route
                path="/admin/announcements"
                element={<AnnouncementAdminListPage />}
            />
            <Route
                path="/admin/announcements/create"
                element={<AnnouncementFormPage />}
            />
            <Route
                path="/admin/announcements/:id/edit"
                element={<AnnouncementFormPage />}
            />
            <Route path="/admin/surveys" element={<SurveyAdminListPage />} />
            <Route path="/admin/surveys/create" element={<SurveyFormPage />} />
            <Route
                path="/admin/surveys/:id/edit"
                element={<SurveyFormPage />}
            />
            <Route
                path="/admin/surveys/:id/results"
                element={<SurveyResultsPage />}
            />
            <Route path="/admin/finance" element={<FinanceListPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/users" element={<UserListPage />} />
        </AnimationRoutes>
    </ZMPRouter>
);

export default Routes;
