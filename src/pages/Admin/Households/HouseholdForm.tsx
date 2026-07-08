import React from "react";
import { Box, Text } from "zmp-ui";
import { Input, TextArea, Radio, Checkbox } from "@components/customized";
import { LOAI_SO_HUU_LABEL } from "@constants/domain";
import { LoaiSoHuu } from "@dts";
import { HouseholdInput } from "@service/householdApi";

export interface HouseholdFormValues {
    cluster: string;
    address: string;
    headOfHousehold: string;
    phone: string;
    memberCount: string;
    ownershipType: LoaiSoHuu;
    needsSupport: boolean;
    note: string;
}

export const EMPTY_HOUSEHOLD_FORM: HouseholdFormValues = {
    cluster: "",
    address: "",
    headOfHousehold: "",
    phone: "",
    memberCount: "",
    ownershipType: "chinh_chu",
    needsSupport: false,
    note: "",
};

export function toHouseholdInput(values: HouseholdFormValues): HouseholdInput {
    return {
        cluster: values.cluster.trim(),
        address: values.address.trim(),
        headOfHousehold: values.headOfHousehold.trim(),
        phone: values.phone.trim() || undefined,
        memberCount: values.memberCount
            ? Number(values.memberCount)
            : undefined,
        ownershipType: values.ownershipType,
        needsSupport: values.needsSupport,
        note: values.note.trim() || undefined,
    };
}

export function isHouseholdFormValid(values: HouseholdFormValues): boolean {
    return !!(
        values.cluster.trim() &&
        values.address.trim() &&
        values.headOfHousehold.trim()
    );
}

interface HouseholdFormProps {
    values: HouseholdFormValues;
    onChange: (values: HouseholdFormValues) => void;
}

/**
 * Bo truong dung chung cho tao moi/chinh sua ho dan (dung o Sheet tao moi va man chi tiet).
 */
const HouseholdForm: React.FC<HouseholdFormProps> = ({ values, onChange }) => {
    const set = <K extends keyof HouseholdFormValues>(
        key: K,
        value: HouseholdFormValues[K],
    ) => onChange({ ...values, [key]: value });

    return (
        <Box style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input
                label="Cụm dân cư"
                placeholder="VD: Cụm 3"
                value={values.cluster}
                onChange={e => set("cluster", e.target.value)}
            />
            <Input
                label="Địa chỉ"
                placeholder="Số nhà, ngõ, đường..."
                value={values.address}
                onChange={e => set("address", e.target.value)}
            />
            <Input
                label="Chủ hộ"
                placeholder="Họ tên chủ hộ"
                value={values.headOfHousehold}
                onChange={e => set("headOfHousehold", e.target.value)}
            />
            <Input
                label="Số điện thoại"
                value={values.phone}
                onChange={e => set("phone", e.target.value)}
            />
            <Input
                label="Số nhân khẩu"
                type="number"
                value={values.memberCount}
                onChange={e => set("memberCount", e.target.value)}
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
            <Checkbox
                label="Hộ cần hỗ trợ"
                value="needsSupport"
                checked={values.needsSupport}
                onChange={() => set("needsSupport", !values.needsSupport)}
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

export default HouseholdForm;
