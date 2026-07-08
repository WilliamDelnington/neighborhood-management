import React from "react";
import { Box, Select, Text } from "zmp-ui";
import { Checkbox, Input, Radio, TextArea } from "@components/customized";
import { HouseholdPicker } from "@components/admin";
import { LOAI_SO_HUU_LABEL, MUC_DO_AN_NINH_LABEL } from "@constants/domain";
import { Household, LoaiSoHuu, MucDoAnNinh } from "@dts";
import { SecurityRecordInput } from "@service/securityApi";

export interface SecurityFormValues {
    householdId: string;
    householdLabel: string;
    ownershipType: LoaiSoHuu;
    renterCount: string;
    temporaryResidenceDeclared: boolean;
    hasCamera: boolean;
    hasSecurityComplaint: boolean;
    level: MucDoAnNinh;
    reportedToPolice: boolean;
    handlingStatus: string;
    note: string;
}

export const EMPTY_SECURITY_FORM: SecurityFormValues = {
    householdId: "",
    householdLabel: "",
    ownershipType: "chinh_chu",
    renterCount: "",
    temporaryResidenceDeclared: false,
    hasCamera: false,
    hasSecurityComplaint: false,
    level: "binh_thuong",
    reportedToPolice: false,
    handlingStatus: "",
    note: "",
};

export function toSecurityInput(
    values: SecurityFormValues,
): SecurityRecordInput {
    return {
        householdId: values.householdId,
        ownershipType: values.ownershipType,
        renterCount: values.renterCount
            ? Number(values.renterCount)
            : undefined,
        temporaryResidenceDeclared: values.temporaryResidenceDeclared,
        hasCamera: values.hasCamera,
        hasSecurityComplaint: values.hasSecurityComplaint,
        level: values.level,
        reportedToPolice: values.reportedToPolice,
        handlingStatus: values.handlingStatus.trim() || undefined,
        note: values.note.trim() || undefined,
    };
}

export function isSecurityFormValid(values: SecurityFormValues): boolean {
    return !!values.householdId;
}

interface SecurityFormProps {
    values: SecurityFormValues;
    onChange: (values: SecurityFormValues) => void;
}

/**
 * Bo truong dung chung cho tao moi/chinh sua ho so an ninh, tam tru, nha cho thue.
 */
const SecurityForm: React.FC<SecurityFormProps> = ({ values, onChange }) => {
    const set = <K extends keyof SecurityFormValues>(
        key: K,
        value: SecurityFormValues[K],
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
            <Box>
                <Text size="xSmall" className="text-text_2 mb-1">
                    Hình thức sở hữu
                </Text>
                <Box flex style={{ gap: 20 }}>
                    {(
                        Object.entries(LOAI_SO_HUU_LABEL) as [
                            LoaiSoHuu,
                            string,
                        ][]
                    ).map(([key, label]) => (
                        <Radio
                            key={key}
                            label={label}
                            checked={values.ownershipType === key}
                            onChange={() => set("ownershipType", key)}
                        />
                    ))}
                </Box>
            </Box>
            <Input
                label="Số người thuê"
                type="number"
                value={values.renterCount}
                onChange={e => set("renterCount", e.target.value)}
            />
            <Box style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Checkbox
                    label="Đã khai báo tạm trú"
                    value="temporaryResidenceDeclared"
                    checked={values.temporaryResidenceDeclared}
                    onChange={() =>
                        set(
                            "temporaryResidenceDeclared",
                            !values.temporaryResidenceDeclared,
                        )
                    }
                />
                <Checkbox
                    label="Có camera"
                    value="hasCamera"
                    checked={values.hasCamera}
                    onChange={() => set("hasCamera", !values.hasCamera)}
                />
                <Checkbox
                    label="Có phản ánh an ninh"
                    value="hasSecurityComplaint"
                    checked={values.hasSecurityComplaint}
                    onChange={() =>
                        set(
                            "hasSecurityComplaint",
                            !values.hasSecurityComplaint,
                        )
                    }
                />
                <Checkbox
                    label="Đã báo công an khu vực"
                    value="reportedToPolice"
                    checked={values.reportedToPolice}
                    onChange={() =>
                        set("reportedToPolice", !values.reportedToPolice)
                    }
                />
            </Box>
            <Select
                label="Mức độ"
                closeOnSelect
                value={values.level}
                onChange={v => set("level", v as MucDoAnNinh)}
            >
                {(
                    Object.entries(MUC_DO_AN_NINH_LABEL) as [
                        MucDoAnNinh,
                        string,
                    ][]
                ).map(([key, label]) => (
                    <Select.Option key={key} title={label} value={key} />
                ))}
            </Select>
            <Input
                label="Tình trạng xử lý"
                placeholder="VD: Đã xử lý, đang theo dõi..."
                value={values.handlingStatus}
                onChange={e => set("handlingStatus", e.target.value)}
            />
            <TextArea
                label="Ghi chú"
                placeholder="Ghi chú thêm (nếu có)"
                value={values.note}
                onChange={e => set("note", e.target.value)}
            />
        </Box>
    );
};

export default SecurityForm;
