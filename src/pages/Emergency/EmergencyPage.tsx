import React from "react";
import { PageLayout, AppBottomNav } from "@components/layout";
import { VerticalUtinities } from "@components/utilities";
import { CONTACTS } from "@constants/utinities";

const EmergencyPage: React.FC = () => (
    <PageLayout
        id="emergency-page"
        title="Liên hệ khẩn cấp"
        bottomNav={<AppBottomNav />}
    >
        <VerticalUtinities
            title="Số điện thoại khẩn cấp"
            utinities={CONTACTS}
        />
    </PageLayout>
);

export default EmergencyPage;
