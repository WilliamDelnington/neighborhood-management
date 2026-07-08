import React from "react";
import { Box, DatePicker, Select } from "zmp-ui";
import { Checkbox, TextArea, Input } from "@components/customized";
import { HouseholdPicker } from "@components/admin";
import { MUC_NGUY_CO_PCCC_LABEL } from "@constants/domain";
import { Household, MucNguyCoPccc } from "@dts";
import { PcccCheckInput } from "@service/pcccApi";

export interface PcccFormValues {
    householdId: string;
    householdLabel: string;
    inspectionDate: Date;
    hasFireExtinguisher: boolean;
    hasEmergencyExit: boolean;
    hasIndoorEvCharging: boolean;
    hasGasStoveOrStorageOrBusiness: boolean;
    isCrowdedRental: boolean;
    riskLevel: MucNguyCoPccc;
    remediationNeeded: string;
    followUpStatus: string;
}

export const EMPTY_PCCC_FORM: PcccFormValues = {
    householdId: "",
    householdLabel: "",
    inspectionDate: new Date(),
    hasFireExtinguisher: false,
    hasEmergencyExit: false,
    hasIndoorEvCharging: false,
    hasGasStoveOrStorageOrBusiness: false,
    isCrowdedRental: false,
    riskLevel: "xanh",
    remediationNeeded: "",
    followUpStatus: "",
};

export function toPcccInput(values: PcccFormValues): PcccCheckInput {
    return {
        householdId: values.householdId,
        inspectionDate: values.inspectionDate.toISOString(),
        hasFireExtinguisher: values.hasFireExtinguisher,
        hasEmergencyExit: values.hasEmergencyExit,
        hasIndoorEvCharging: values.hasIndoorEvCharging,
        hasGasStoveOrStorageOrBusiness: values.hasGasStoveOrStorageOrBusiness,
        isCrowdedRental: values.isCrowdedRental,
        riskLevel: values.riskLevel,
        remediationNeeded: values.remediationNeeded.trim() || undefined,
        followUpStatus: values.followUpStatus.trim() || undefined,
    };
}

export function isPcccFormValid(values: PcccFormValues): boolean {
    return !!(values.householdId && values.inspectionDate);
}

interface PcccFormProps {
    values: PcccFormValues;
    onChange: (values: PcccFormValues) => void;
}

/**
 * Bo truong dung chung cho tao moi/chinh sua dot kiem tra PCCC.
 */
const PcccForm: React.FC<PcccFormProps> = ({ values, onChange }) => {
    const set = <K extends keyof PcccFormValues>(
        key: K,
        value: PcccFormValues[K],
    ) => onChange({ ...values, [key]: value });

    return (
        <Box style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <HouseholdPicker
                value={values.householdId}
                valueLabel={values.householdLabel}
                onChange={(householdId, household: Household) =>
                    onChange({
                        ...values,
                        householdId,
                        householdLabel: `${household.code} — ${household.address}`,
                    })
                }
            />
            <DatePicker
                label="Ngày kiểm tra"
                title="Chọn ngày kiểm tra"
                value={values.inspectionDate}
                onChange={date => set("inspectionDate", date)}
                placeholder="Chọn ngày kiểm tra"
            />
            <Box style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Checkbox
                    label="Có bình chữa cháy"
                    value="hasFireExtinguisher"
                    checked={values.hasFireExtinguisher}
                    onChange={() =>
                        set("hasFireExtinguisher", !values.hasFireExtinguisher)
                    }
                />
                <Checkbox
                    label="Có lối thoát hiểm"
                    value="hasEmergencyExit"
                    checked={values.hasEmergencyExit}
                    onChange={() =>
                        set("hasEmergencyExit", !values.hasEmergencyExit)
                    }
                />
                <Checkbox
                    label="Có sạc xe điện trong nhà"
                    value="hasIndoorEvCharging"
                    checked={values.hasIndoorEvCharging}
                    onChange={() =>
                        set("hasIndoorEvCharging", !values.hasIndoorEvCharging)
                    }
                />
                <Checkbox
                    label="Có bếp gas / kho hàng / kinh doanh"
                    value="hasGasStoveOrStorageOrBusiness"
                    checked={values.hasGasStoveOrStorageOrBusiness}
                    onChange={() =>
                        set(
                            "hasGasStoveOrStorageOrBusiness",
                            !values.hasGasStoveOrStorageOrBusiness,
                        )
                    }
                />
                <Checkbox
                    label="Nhà cho thuê đông người"
                    value="isCrowdedRental"
                    checked={values.isCrowdedRental}
                    onChange={() =>
                        set("isCrowdedRental", !values.isCrowdedRental)
                    }
                />
            </Box>
            <Select
                label="Mức nguy cơ"
                closeOnSelect
                value={values.riskLevel}
                onChange={v => set("riskLevel", v as MucNguyCoPccc)}
            >
                {(
                    Object.entries(MUC_NGUY_CO_PCCC_LABEL) as [
                        MucNguyCoPccc,
                        string,
                    ][]
                ).map(([key, label]) => (
                    <Select.Option key={key} title={label} value={key} />
                ))}
            </Select>
            <TextArea
                label="Việc cần khắc phục"
                placeholder="Mô tả các việc cần khắc phục (nếu có)"
                value={values.remediationNeeded}
                onChange={e => set("remediationNeeded", e.target.value)}
            />
            <Input
                label="Tình trạng theo dõi"
                placeholder="VD: Đã nhắc nhở, đang chờ khắc phục..."
                value={values.followUpStatus}
                onChange={e => set("followUpStatus", e.target.value)}
            />
        </Box>
    );
};

export default PcccForm;
