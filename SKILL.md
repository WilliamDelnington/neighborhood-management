You are a senior full-stack developer. Build a Zalo Mini App to manage the neighborhood Hoa Binh, ward Duong Noi, Hanoi with Next.js, Typescript, MongoDB, Mongosse, and TailwindCSS

# Hoa Binh Neighborhood Management Zalo Mini App

## Mission

Create a complete Zalo Mini App version of the existing neighborhood management web application in `../quan-ly-to-dan-pho`.

Use the existing app as the source of truth for:

-   Business modules and Vietnamese content.
-   UI style, layout intent, color system, spacing, cards, forms, tables, badges, and responsive behavior.
-   Data entities and workflows.
-   Admin and resident-facing feature coverage.

Use the existing Zalo Mini App template in this folder as the source of truth for:

-   Zalo Mini App project shape, ZMP runtime, `zmp-sdk`, `zmp-ui`, app config, deployment scripts, and mobile-first behavior.
-   Zalo Mini App authentication and permission patterns.
-   Notification permission flow and future Official Account notification expansion.

Do not synchronize live data from `../quan-ly-to-dan-pho`. Recreate the application using temporary MongoDB data for the Hoa Binh Zalo Mini App.

Note: the requested stack says `Mongosse`; implement this as `Mongoose`.

## Required Technologies

Frontend:

-   Zalo Mini App React runtime from the current template.
-   TypeScript.
-   TailwindCSS.
-   `zmp-sdk` for Zalo APIs.
-   `zmp-ui` / ZaUI components where they fit the existing UI.
-   Zustand or React context for lightweight client state.
-   Mobile-first routing and screen structure suitable for Zalo Mini App.

Backend:

-   Node.js with TypeScript.
-   Prefer Next.js API routes only if the target deployment supports the chosen Zalo Mini App architecture; otherwise build a separate Node.js API service with Express/Fastify.
-   MongoDB.
-   Mongoose.
-   JWT or signed server session tokens for app sessions after Zalo identity verification.
-   Zod or equivalent schema validation.
-   Multer/S3-compatible object storage adapter or a local dev storage adapter for attachments.

Tooling:

-   ESLint and Prettier.
-   Environment-based configuration.
-   Seed script for roles, admin users, demo households, and sample notices.
-   Scripts for lint, typecheck, build, seed, and dev.

## Zalo Mini App Requirements

Use the official Zalo Mini App docs as implementation guidance:

-   ZaUI documents: `https://miniapp.zaloplatforms.com/documents/zaui`
-   API documents: `https://miniapp.zaloplatforms.com/documents/api/`

Apply these Zalo APIs where relevant:

-   `authorize` before requesting protected user capabilities.
-   `getAccessToken`, `getUserID`, and `getUserInfo` for Zalo account login.
-   `getPhoneNumber` only when the app needs phone linking and has permission.
-   `getSetting` and `openPermissionSetting` for permission-state UX.
-   `requestSendNotification` for notification permission.
-   `showToast`, `closeLoading`, `setNavigationBarTitle`, `setNavigationBarColor`, and `configAppView` for Mini App UX polish.
-   `chooseImage` or `openMediaPicker` for complaint attachments.
-   `openPhone`, `openSMS`, `openChat`, `followOA`, and `interactOA` for resident contact and OA flows.

Do not assume all Zalo APIs are available in production without approval. Add graceful fallbacks and clear permission-request screens.

## Source Application Parity

Before coding, inspect `../quan-ly-to-dan-pho`:

-   `src/app/admin`
-   `src/app/web`
-   `src/app/api`
-   `src/models`
-   `src/services`
-   `src/components/admin`
-   `src/components/web`
-   `src/components/ui`
-   `src/lib`
-   `src/types`

Preserve all existing functional modules:

-   Dashboard.
-   Household management.
-   Citizen/population management.
-   Complaint and petition management.
-   PCCC/fire safety tracking.
-   Security, temporary residence, and rental-house tracking.
-   Meetings.
-   Announcements.
-   Surveys.
-   Neighborhood finance.
-   Reports.
-   Import/export.
-   File/form assets.
-   Settings.
-   Resident account/profile.
-   Complaint lookup.

When a module cannot be fully completed in one pass, create a working skeleton with real routes, role guards, models, validation, empty states, and TODO comments that state the missing backend behavior precisely.

## Folder Structure

Use this target structure unless the existing template strongly requires a small adaptation:

```text
.
├── app-config.json
├── zmp-cli.json
├── src
│   ├── app.ts
│   ├── app.tsx
│   ├── components
│   │   ├── admin
│   │   ├── citizen
│   │   ├── common
│   │   ├── layout
│   │   ├── notifications
│   │   ├── role
│   │   └── ui
│   ├── css
│   ├── hooks
│   ├── pages
│   │   ├── Home
│   │   ├── Login
│   │   ├── Profile
│   │   ├── AdminDashboard
│   │   ├── Households
│   │   ├── Citizens
│   │   ├── Complaints
│   │   ├── Security
│   │   ├── Pccc
│   │   ├── Meetings
│   │   ├── Announcements
│   │   ├── Surveys
│   │   ├── Finance
│   │   ├── Reports
│   │   ├── Files
│   │   └── Settings
│   ├── services
│   │   ├── apiClient.ts
│   │   ├── authApi.ts
│   │   ├── zalo.ts
│   │   └── module APIs
│   ├── store
│   ├── types
│   └── utils
├── backend
│   ├── src
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── validators
│   │   ├── notifications
│   │   ├── storage
│   │   └── utils
│   ├── scripts
│   └── tests
└── docs
```

The backend is a separate Next.js project living as a sibling folder, `../quan-ly-to-dan-pho-hoa-binh-backend-app`, not nested inside this repo. It keeps the same boundaries under:

```text
../quan-ly-to-dan-pho-hoa-binh-backend-app/src/app/api
../quan-ly-to-dan-pho-hoa-binh-backend-app/src/models
../quan-ly-to-dan-pho-hoa-binh-backend-app/src/services
../quan-ly-to-dan-pho-hoa-binh-backend-app/src/lib
```

## General UI Design

Preserve the visual identity from `../quan-ly-to-dan-pho`:

-   Civic blue primary color `#2563EB`.
-   Light background `#F8FAFC`.
-   Modern cards with restrained shadows and clear spacing.
-   Vietnamese-first labels and content.
-   No sales CRM look.
-   Clear empty, loading, error, and permission-denied states.
-   Forms must be simple, readable, and friendly on mobile.

Adapt for Zalo Mini App:

-   Mobile-first screens, safe-area aware.
-   Bottom navigation or role-aware quick actions instead of desktop sidebar on resident screens.
-   Admin screens may use compact tab/section navigation, collapsible menu, and dense tables adapted to mobile.
-   Use ZaUI components for Mini App-native controls where practical: Page, Header, BottomNavigation, Tabs, List, Button, Input, Select, Picker, DatePicker, Switch, Checkbox, Radio, Modal, Sheet, Snackbar/Toast.
-   Keep touch targets large enough for field use by officials and residents.
-   Avoid horizontal overflow in tables; use filter sheets, summary cards, and row detail screens on mobile.

## User Roles

Support these roles exactly:

-   `resident`: Người dân.
-   `neighborhood_leader`: Tổ trưởng.
-   `secretary`: Bí thư.
-   `regional_police`: Công an khu vực.
-   `people_committee_official`: Cán bộ UBND.
-   `admin`: System administrator or super administrator.

Administrators must be able to:

-   View users.
-   Link users to Zalo IDs, phone numbers, households, and citizens.
-   Assign and change roles.
-   Activate/deactivate accounts.
-   Reset or revoke sessions.
-   Review audit logs for sensitive actions.

Role display names must be Vietnamese in the UI.

## Role-Based Experience

Resident:

-   See public announcements, meetings, surveys, forms, and personal profile.
-   Submit complaints.
-   Track only their own complaints.
-   Register meeting attendance.
-   Answer surveys once per eligible survey.
-   View linked household/citizen summary only if approved by admin.

Neighborhood Leader:

-   Use resident features.
-   View operational dashboard for assigned area.
-   Manage households and citizens in assigned clusters if permitted.
-   Receive and process complaints.
-   Create meeting attendance records.
-   Create local announcements if permitted.
-   View reports for assigned scope.

Secretary:

-   Use resident features.
-   Manage party/member-related population attributes.
-   Prepare meeting content, minutes, announcements, and surveys.
-   View reports relevant to community organization work.

Regional Police:

-   Use resident features.
-   Access security, temporary residence, rental-house, and complaint modules.
-   Update security handling status.
-   View household and citizen records needed for security work.
-   Must not access finance unless explicitly granted.

People Committee Officials:

-   Use resident features.
-   View escalated complaints, reports, statistics, PCCC/security summaries, and public-service data.
-   Update forwarded complaint status and official notes.
-   Export reports if permitted.

Admin:

-   Full configuration, role assignment, user management, import/export, seed/setup, and audit access.

## Admin Modules

Dashboard:

-   Total households.
-   Total citizens.
-   Rental houses.
-   Households needing support.
-   New complaints.
-   In-progress complaints.
-   High-risk PCCC records.
-   Upcoming meetings.
-   Finance summary.
-   Survey participation.
-   Role-specific task lists.

Users and Roles:

-   List users from Zalo login and manually created admin accounts.
-   Assign roles and scopes.
-   Link to household/citizen.
-   Lock/unlock account.
-   View login history and audit trail.

Households:

-   CRUD.
-   Household code format `HB001`, `HB002`, etc.
-   Residential cluster.
-   Address.
-   Head of household.
-   Phone.
-   Population count.
-   Owner-occupied/rental.
-   Support needs.
-   Notes.
-   Import/export Excel.

Citizens:

-   CRUD.
-   Full name, phone, CCCD, birth date, gender.
-   Household relationship.
-   Permanent/temporary residence.
-   Elderly, child, disabled/support-needed flags.
-   Party member, youth union/member flags.
-   Link to Zalo user where applicable.

Complaints:

-   Resident submission intake.
-   Complaint code format `HB-PA-YYYY-0001`.
-   Categories: An ninh trật tự, PCCC, Vệ sinh môi trường, Hạ tầng điện nước, Chiếu sáng, Tranh chấp dân cư, Tạm trú / nhà cho thuê, Góp ý chung, Khác.
-   Statuses: Mới tiếp nhận, Đã tiếp nhận, Đang xử lý, Đã chuyển UBND phường, Đã xử lý, Đóng.
-   Timeline.
-   Assignee.
-   Expected and actual completion dates.
-   Attached images.
-   Internal notes and public updates.
-   Escalation to People Committee Officials.

PCCC:

-   Per-household checks.
-   Fire extinguisher.
-   Emergency exit.
-   EV charging indoors.
-   Gas stove/storage/business risk.
-   Crowded rental-house risk.
-   Risk level: Xanh, Vàng, Đỏ.
-   Required remediation.
-   Inspection date.
-   Inspector.
-   Follow-up status.

Security, Temporary Residence, Rental Houses:

-   Owner-occupied/rental.
-   Number of renters.
-   Temporary residence declaration.
-   Camera availability.
-   Security complaints.
-   Level: Bình thường, Cần theo dõi, Khẩn cấp.
-   Reported to regional police.
-   Handling status and notes.

Meetings:

-   Title, time, location, content.
-   Attendance list.
-   Minutes.
-   Attachments.
-   Resident attendance registration: Có, Không, Ủy quyền.
-   Role-based meeting creation and publication.

Announcements:

-   Draft and publish.
-   Public Mini App display.
-   Categories: Thông báo chung, Họp dân, PCCC, Vệ sinh môi trường, An ninh trật tự, Khác.
-   Priority and pinned status.
-   Audience targeting by role, household cluster, or all residents.
-   Notification queue entry on publish.

Surveys:

-   Admin creates surveys.
-   Question types: Đồng ý / Không đồng ý, Chọn một, Chọn nhiều, Ý kiến khác.
-   Open/close dates.
-   Eligibility by role/cluster/all.
-   Prevent duplicate responses.
-   Results dashboard and export.

Finance:

-   Income and expense records.
-   Payer/receiver.
-   Amount.
-   Transaction date.
-   Content.
-   Status.
-   Transparent audit log.
-   Export reports.
-   Restrict access to admin and explicitly authorized roles.

Reports:

-   Population report.
-   Complaint report.
-   PCCC report.
-   Security report.
-   Finance report.
-   Meeting attendance report.
-   Survey result report.
-   Export Excel; provide PDF-ready architecture even if PDF is a later enhancement.

Import/Export:

-   Import households from Excel.
-   Import citizens from Excel.
-   Import party/member records where available.
-   Preview and validate before saving.
-   Produce row-level validation errors.
-   Export households, citizens, complaints, reports, and finance data.

Files and Forms:

-   Store public form assets.
-   Support link-based files first.
-   Add storage adapter for binary upload later.
-   Residents can view/download forms.

Settings:

-   App identity.
-   OA information.
-   Emergency contacts.
-   Notification settings.
-   Role permissions.
-   Import/export templates.
-   System seed/reset controls for dev only.

## Modules for Residents

Home:

-   Banner: `Tổ dân phố Hòa Bình`.
-   Subtitle: `Phường Dương Nội, Hà Nội`.
-   Latest announcements.
-   Large action buttons:
    1. Gửi phản ánh
    2. Tra cứu phản ánh
    3. Xem thông báo
    4. Lịch họp
    5. Khảo sát
    6. Biểu mẫu
    7. Liên hệ khẩn cấp
-   Quick contact actions using Zalo or phone APIs.

Zalo Login:

-   User opens app and signs in with Zalo account.
-   Request profile permission only when needed.
-   Send Zalo access token/user ID to backend.
-   Backend verifies identity using the appropriate Zalo flow and creates/updates `User`.
-   If phone or household linking is missing, show onboarding.
-   Do not use phone/password login as the primary resident login in this Zalo Mini App.

Onboarding:

-   Confirm full name.
-   Optional phone permission.
-   Address.
-   Household link request.
-   Consent to app terms and notification preferences.

Complaint Submission:

-   Category, title, content, address/area, images.
-   Show generated complaint code after submission.
-   Store attachments through backend storage adapter.
-   Show public timeline updates only.

Complaint Lookup:

-   Search by complaint code.
-   List complaints owned by the current user.
-   Show status and timeline.
-   Hide internal admin notes.

Announcements:

-   Public list and detail.
-   Pinned/urgent notices.
-   Read/unread state per user.

Meetings:

-   View upcoming meetings.
-   Register attendance: Có, Không, Ủy quyền.
-   View meeting materials if public.

Surveys:

-   List open surveys.
-   Submit eligible answers.
-   Prevent duplicate submissions.

Forms:

-   List public forms and documents.
-   Download or open documents.

Account:

-   Zalo profile summary.
-   Phone, address, linked household/citizen status.
-   Notification permission state.
-   Role display.
-   Logout/revoke local session.

## Modules for Other Roles

Neighborhood Leader:

-   Dashboard, households, citizens, complaints, meetings, announcements, surveys, PCCC summary, reports.
-   Scope data by assigned cluster unless admin grants all-neighborhood scope.

Secretary:

-   Dashboard, announcements, meetings, surveys, citizen civic/organization attributes, reports.
-   No finance modification unless separately granted.

Regional Police:

-   Dashboard, security, temporary residence, rental houses, relevant households/citizens, assigned complaints, PCCC/security reports.
-   No resident private complaint access outside assigned/security scope.

People Committee Officials:

-   Dashboard, escalated complaints, reports, announcements, meeting summaries, PCCC/security summaries.
-   Mostly review/approve/update official status, not daily household editing unless granted.

## MongoDB Models

Implement Mongoose models with timestamps, indexes, and strict TypeScript types.

Core:

-   `User`
-   `RoleAssignment`
-   `Household`
-   `Citizen`
-   `Complaint`
-   `ComplaintTimeline`
-   `Announcement`
-   `Meeting`
-   `MeetingRegistration`
-   `Survey`
-   `SurveyResponse`
-   `PcccCheck`
-   `SecurityRecord`
-   `FinanceTransaction`
-   `FileAsset`
-   `Notification`
-   `NotificationDelivery`
-   `AuditLog`
-   `Setting`
-   `ImportJob`

`User` fields:

-   `zaloUserId` unique sparse.
-   `zaloAppUserId` if different from user ID.
-   `displayName`.
-   `avatarUrl`.
-   `phone`.
-   `email`.
-   `roles`.
-   `primaryRole`.
-   `status`: active, pending, locked.
-   `householdId`.
-   `citizenId`.
-   `assignedClusters`.
-   `permissions`.
-   `lastLoginAt`.
-   `notificationPermission`.
-   `createdBy`, `updatedBy`.

`RoleAssignment` fields:

-   `userId`.
-   `role`.
-   `scopeType`: all, cluster, household, complaint, module.
-   `scopeValues`.
-   `grantedBy`.
-   `grantedAt`.
-   `revokedAt`.

`Notification` fields:

-   `title`.
-   `body`.
-   `type`.
-   `targetRoles`.
-   `targetClusters`.
-   `targetUserIds`.
-   `relatedModel`.
-   `relatedId`.
-   `channel`: in_app, zalo_oa_future.
-   `status`: draft, queued, sent, failed.
-   `createdBy`.

`NotificationDelivery` fields:

-   `notificationId`.
-   `userId`.
-   `channel`.
-   `readAt`.
-   `sentAt`.
-   `failedAt`.
-   `error`.

Indexes:

-   Unique complaint code.
-   Unique household code.
-   Unique Zalo user ID.
-   Survey response unique by `surveyId + userId`.
-   Meeting registration unique by `meetingId + userId`.
-   Frequent filters: status, category, role, cluster, householdId, createdAt.

## Backend API Requirements

Use consistent response format:

```ts
type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
};
```

Required API groups:

-   `/api/auth/zalo/login`
-   `/api/auth/me`
-   `/api/auth/logout`
-   `/api/users`
-   `/api/roles`
-   `/api/households`
-   `/api/citizens`
-   `/api/complaints`
-   `/api/complaints/:id/timeline`
-   `/api/pccc`
-   `/api/security`
-   `/api/meetings`
-   `/api/meetings/:id/register`
-   `/api/announcements`
-   `/api/surveys`
-   `/api/surveys/:id/respond`
-   `/api/finance`
-   `/api/reports`
-   `/api/import`
-   `/api/export`
-   `/api/files`
-   `/api/notifications`
-   `/api/settings`

Every write endpoint must:

-   Validate input.
-   Check authentication.
-   Check role and scope permissions.
-   Write audit logs for sensitive operations.
-   Return sanitized data.

## Security Rules

Authentication:

-   Residents authenticate with Zalo account.
-   Backend must not trust client-provided Zalo profile alone.
-   Server creates its own session/JWT after validating the Zalo login flow.
-   Store tokens securely; never expose secrets in frontend bundles.

Authorization:

-   Apply role-based access control on every API route.
-   Apply scope-based filtering for assigned clusters and linked households.
-   Residents can only see their own data.
-   Admin-only pages and APIs must reject non-admin roles.
-   Finance and role management require explicit permission.

Data protection:

-   Never return password hashes, secrets, raw tokens, or internal-only notes to clients.
-   Validate all request bodies, route params, and query filters.
-   Escape or sanitize rich text.
-   Limit upload types and sizes.
-   Store attachment metadata separately from complaint records.
-   Use rate limits for login, uploads, and public lookup.
-   Use audit logs for role changes, finance changes, complaint status changes, imports, exports, and deletes.

Operational security:

-   Environment variables for MongoDB URI, JWT/session secret, Zalo app credentials, OA credentials, storage credentials, and CORS origins.
-   Separate dev/test/prod configs.
-   Do not commit real secrets.
-   Add seed data only for development.

## Notification Requirements

Keep notifications inside the Zalo Mini App now:

-   Store notifications in MongoDB.
-   Create notifications when announcements are published, complaints change status, meetings are created/updated, surveys open, or admin assigns a task.
-   Show unread count and notification center.
-   Mark read/unread per user.
-   Request notification permission with Zalo API when appropriate.

Design for future Zalo account/OA push:

-   Keep notification creation separate from delivery.
-   Use `NotificationDelivery` records.
-   Define channel adapters: `inAppAdapter`, `zaloOaAdapter`.
-   Leave `zaloOaAdapter` implemented as a safe stub until OA credentials and approval are available.
-   Queue delivery jobs so push can be enabled without changing business modules.

## Code Requirements

General:

-   TypeScript everywhere.
-   Use existing project conventions before inventing new ones.
-   Keep components small and reusable.
-   Keep business logic in services, not UI pages.
-   Keep API calls in service modules, not scattered through components.
-   Use shared domain types between frontend and backend where practical.
-   Use Vietnamese UI text.
-   Avoid hardcoded business data except controlled enum labels and seed data.
-   Prefer real implementations over mock data.
-   If mock data remains for a screen, isolate it clearly and add a removal TODO.

Frontend:

-   Preserve the source app's UI feel while adapting to mobile Mini App constraints.
-   Use role-aware route guards.
-   Handle loading, empty, error, unauthorized, and permission-needed states.
-   Use accessible labels and readable typography.
-   Use optimistic updates only when rollback is implemented.
-   Avoid full-page reload patterns.

Backend:

-   Use Mongoose schemas with indexes and validation.
-   Use service functions for module workflows.
-   Use transactions where multiple documents must stay consistent.
-   Add pagination, search, and filters to list endpoints.
-   Use consistent error handling.
-   Use safe file upload handling.
-   Add seed script and migration-friendly model defaults.

Testing:

-   Add unit tests for permission helpers, code generation, validators, and services.
-   Add API tests for auth, role guards, complaint ownership, survey duplicate prevention, and meeting registration uniqueness.
-   Add smoke tests for primary Mini App screens.

## Experience Requirements

Resident experience:

-   Fast login with Zalo.
-   Minimal typing.
-   Clear status tracking for complaints.
-   Simple, friendly forms.
-   No admin data leakage.
-   Works well on small screens and low-bandwidth mobile networks.

Official/admin experience:

-   Dense but readable operational screens.
-   Quick search/filter.
-   Clear assignment and status controls.
-   Exportable reports.
-   Strong auditability.
-   Role-specific navigation to reduce clutter.

Accessibility and localization:

-   Vietnamese labels everywhere.
-   Dates in Vietnamese-friendly format.
-   Currency in VND.
-   Error messages must explain what to fix.
-   Touch targets must be large enough for mobile use.

Performance:

-   Paginate large lists.
-   Debounce search.
-   Cache stable reference data.
-   Lazy-load heavy screens.
-   Compress images before upload when possible.

## Implementation Order

1. Inspect the source web app and current Zalo template.
2. Decide backend shape: separate Node.js API service or Next.js API backend.
3. Configure environment variables.
4. Create MongoDB connection and Mongoose models.
5. Build Zalo login and session flow.
6. Build RBAC and scope middleware.
7. Create shared API client and response handling.
8. Rebuild the resident home, login/onboarding, announcements, complaints, meetings, surveys, forms, and account screens.
9. Rebuild admin/official dashboards and role-aware navigation.
10. Implement households and citizens.
11. Implement complaints end to end.
12. Implement PCCC and security modules.
13. Implement meetings, announcements, surveys, files, finance, reports, import/export, and settings.
14. Implement notification center and in-app delivery.
15. Add future-ready Zalo OA notification adapter.
16. Seed demo data.
17. Run lint, typecheck, build, and targeted tests.

## Acceptance Criteria

The implementation is complete when:

-   The Zalo Mini App runs locally with ZMP tooling.
-   The backend runs locally and connects to MongoDB.
-   A Zalo user can log in, receive a local app session, and see role-appropriate UI.
-   Admin can assign roles.
-   Each required role sees the correct module set.
-   All modules from `../quan-ly-to-dan-pho` exist in the Hoa Binh Mini App.
-   Complaints work end to end from resident submission to admin processing and resident tracking.
-   Notifications exist inside the Mini App and are architected for later Zalo/OA push delivery.
-   MongoDB models exist for all listed entities.
-   Security rules are enforced server-side.
-   No protected admin/resident data leaks across roles.
-   Lint, typecheck, and build pass, or remaining failures are documented with exact file paths and fixes.

## Business Registration and Document Verification

Add a dynamic business-document workflow for household owners. The workflow
must not hard-code the documents required by a business category: administrators
configure a reusable document catalog and a per-business-type requirement matrix.

### Role terminology and permissions

For this module, `house_owner` means a `resident` account that is the owner of,
or has been explicitly delegated to manage, the household/business concerned.
Do not introduce a second, conflicting authentication role. Resolve this through
the user's household/business scope and permissions.

| Role                        | Permission in this module                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `admin`                     | Manage document types; configure document rules for each business type; view all records and audit history.                                      |
| `house_owner`               | Register and manage only their authorized businesses; view requirements; upload and replace supporting documents; view review feedback.          |
| `people_committee_official` | Review common legal documents such as business registration and food-safety documents; approve or request supplementation within assigned scope. |
| `regional_police`           | Review police-owned/specialized documents such as security commitments and fire-safety documents within assigned scope.                          |
| `neighborhood_leader`       | View-only list and verification progress for businesses in assigned clusters; never approve or access files outside scope.                       |
| `secretary`                 | View-only aggregate dashboard and permitted progress reports; never approve documents.                                                           |

Every server-side review action must enforce both role and assigned scope. Hiding
an approval button in the UI is not authorization.

### Data model

Add the following Mongoose models with strict TypeScript types, timestamps,
indexes, and Zod validation at API boundaries:

-   `DocumentType`: `name`, unique `code`, `description`, `hasIssueDate`,
    `hasExpiryDate`, `active`, `createdBy`, `updatedBy`. This is the master legal
    document catalog.
-   `BusinessType`: `name`, `description`, `active`, `sortOrder`, and
    `requiredDocuments`. Each rule contains `documentTypeId`, `isRequired`,
    `warningBeforeDays`, and an optional `reviewerRoles` list when a document must
    be reviewed by a particular authority.
-   `Business`: household/business-owner relationship, business type, address or
    cluster, and status: `unverified`, `pending_approval`, `need_supplement`, or
    `verified`.
-   `BusinessDocument`: `businessId`, `documentTypeId`, `fileAssetId`, optional
    `docNumber`, `issueDate`, `expiryDate`, status (`pending`, `approved`,
    `rejected`), `rejectionReason`, `uploadedBy`, `reviewedBy`, and
    `reviewedAt`. Preserve each submission as a version or retain its historical
    file reference; never erase an earlier uploaded file merely because a resident
    replaces it.

Continue to use the existing `FileAsset` collection as the single source of
truth for physical file metadata and storage. A business document stores only a
reference to `FileAsset`; it must not duplicate URLs or binary content.

Use unique/index constraints appropriate for lookups, including `DocumentType`
code, `BusinessDocument.businessId`, `BusinessDocument.documentTypeId`, and
business status/cluster. Enforce one active submission per
business-document-type while retaining prior versions for auditability.

### Resident and official workflow

1. A house owner creates or selects a business; its initial status is
   `unverified`.
2. The app reads `BusinessType.requiredDocuments` and renders the required and
   optional upload form dynamically.
3. The owner uploads the physical file through the normal file-upload endpoint.
   The server creates a `FileAsset`, validates its type, size, ownership, and
   intended related model, then accepts its ID in the business-document request.
4. The service creates a new `BusinessDocument` version or changes the active
   reference to the newly uploaded asset. Once there is a submission to review,
   the business becomes `pending_approval`.
5. An authorized official reviews each document and either approves it or
   requests supplementation with a clear Vietnamese rejection reason. A rejected
   document moves the business to `need_supplement` and creates an in-app
   notification; design the notification event so a future Zalo OA/ZNS adapter
   can deliver it without changing business logic.
6. A business becomes `verified` only after every required document is present,
   valid, and approved by the authority required by its rule. Optional documents
   cannot block verification. Re-open verification if an approved required
   document expires or is superseded.

### Required API surface

Keep the common `ApiResponse<T>` format and add the following routes. Use the
project's actual App Router route structure while preserving these semantics:

-   `GET/POST/PATCH /api/document-types` and `DELETE /api/document-types/:id` —
    admin only; reject deletion when a type is referenced, or safely deactivate it
    instead.
-   `GET/POST/PATCH /api/business-types` — admin only.
-   `PUT /api/business-types/:id/document-rules` — admin only; replace the rules
    atomically after validating every document type exists and is active.
-   `GET /api/businesses/:businessId/required-documents` — authorized owner or
    scoped reviewer. Return the merged requirement matrix, active submission,
    review state, safe file metadata, and missing/expired state.
-   `POST /api/businesses/:businessId/documents` — authorized owner only. Accept
    `documentTypeId`, `fileAssetId`, and optional document number/issue/expiry
    dates. Verify the asset exists, belongs to the caller's upload session, and is
    compatible with the business before creating the reference.
-   `PUT /api/businesses/:businessId/documents/:documentId/review` — only the
    reviewer role declared by the document rule (or admin). Accept an approval
    decision and require a rejection reason when rejected.
-   `GET /api/businesses` and `GET /api/businesses/:id` — apply household,
    business, and cluster scope filters before querying. Support pagination and
    status/type search for authorized operational users.

Use transactions for upload-to-document-to-business-state updates where the
deployment supports MongoDB transactions. Otherwise implement an idempotent
service operation with compensating cleanup that never leaves a dangling
`BusinessDocument.fileAssetId` reference.

### Security, privacy, and audit

-   Check ownership by the business owner or an explicit household-management
    delegation, not a client-supplied user ID.
-   File-preview/download endpoints must require the same ownership or reviewer
    scope as the document itself. Do not expose raw storage URLs for protected
    documents; issue authorized, short-lived access where supported by storage.
-   Allow only explicitly configured document MIME types and sizes; scan or queue
    files for scanning when the selected storage implementation supports it.
-   Record `UPDATE_BUSINESS_DOCUMENT_RULES`, document upload/replacement,
    approve/reject, business-status transitions, and any file-access-sensitive
    action in `AuditLog`, including actor, target, timestamp, prior state, and
    resulting state. Do not log document contents or secrets.
-   An expired `FileAsset` association, missing asset, inactive document type, or
    cross-business asset ID must fail validation with a useful Vietnamese error.

### UI and Mini App experience

The resident app must provide a compact mobile-first "Hộ kinh doanh" area:

-   business type selection and a dynamic checklist showing required, optional,
    uploaded, pending, approved, rejected, and expiring documents;
-   camera/gallery/file upload with progress, retry, validation errors, and a
    clear replacement flow that preserves review history;
-   status timeline and Vietnamese reviewer feedback; and
-   no access to internal reviewer notes or documents from other households.

Official/admin screens must provide filterable lists, per-document preview,
approve/request-supplement actions with mandatory reason on rejection, clear
overall verification status, and audit visibility. `neighborhood_leader` and
`secretary` screens are explicitly read-only; approval controls and their API
permissions must be absent.

### Tests and acceptance criteria for this module

Add unit/API coverage for document-rule validation, household ownership and
cluster scope, reviewer-role guards, file-asset reference validation, document
replacement history, and the rule that only all-approved required documents
verify a business. Verify at minimum that:

-   adding a required document to a restaurant business type immediately appears
    in the owner's dynamic checklist;
-   a successful owner upload creates a `FileAsset` and a valid
    `BusinessDocument` reference;
-   a neighborhood leader receives `403 Forbidden` for a review request even when
    calling the endpoint directly;
-   a rejection changes the business to `need_supplement` and notifies the owner;
    and
-   a business cannot become `verified` until every required document has been
    approved by its authorized reviewer.
