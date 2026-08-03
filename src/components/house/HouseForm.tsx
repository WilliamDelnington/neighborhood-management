import React, { useState } from "react";
import { Box, Text } from "zmp-ui";
import { Input, TextArea } from "@components/customized";
import NeighborhoodPickerSheet from "@components/household/NeighborhoodPickerSheet";
import { hasPermission } from "@components/role";
import { useStore } from "@store";
import { HouseInput } from "@service/houseApi";

export interface HouseFormValues {
    cluster: string;
    address: string;
    note: string;
}

export const EMPTY_HOUSE_FORM: HouseFormValues = {
    cluster: "",
    address: "",
    note: "",
};

export function toHouseInput(values: HouseFormValues): HouseInput {
    return {
        cluster: values.cluster.trim(),
        address: values.address.trim(),
        note: values.note.trim() || undefined,
    };
}

export function isHouseFormValid(values: HouseFormValues): boolean {
    return !!(values.cluster.trim() && values.address.trim());
}

interface HouseFormProps {
    values: HouseFormValues;
    onChange: (values: HouseFormValues) => void;
}

/**
 * Bo truong dung chung cho tao moi/chinh sua nha so (Sheet tao moi va man chi tiet).
 */
const HouseForm: React.FC<HouseFormProps> = ({ values, onChange }) => {
    const [pickerVisible, setPickerVisible] = useState(false);
    const user = useStore(state => state.user);
    // Chi nguoi dung co quyen "neighborhoods.read" (to truong/admin) moi thay
    // picker chon tu danh sach to dan pho chinh thuc - house_owner tu khai bao
    // cum dan cu tu do bang text (khong co quyen do), giong fallback cua
    // admin-web-app/HouseForm.tsx khi khong co quyen "streets.read".
    const canPickNeighborhood = hasPermission(user, "neighborhoods.read");
    const set = <K extends keyof HouseFormValues>(
        key: K,
        value: HouseFormValues[K],
    ) => onChange({ ...values, [key]: value });

    return (
        <Box style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {canPickNeighborhood ? (
                <Box>
                    <Text size="xSmall" className="text-text_2 mb-1">
                        Cụm dân cư
                    </Text>
                    <Box
                        className="bg-ng_10 rounded-lg px-3 py-2"
                        onClick={() => setPickerVisible(true)}
                    >
                        <Text
                            size="small"
                            className={values.cluster ? "" : "text-text_3"}
                        >
                            {values.cluster || "Chọn cụm dân cư..."}
                        </Text>
                    </Box>
                </Box>
            ) : (
                <Input
                    label="Cụm dân cư"
                    placeholder="VD: Cụm 3"
                    value={values.cluster}
                    onChange={e => set("cluster", e.target.value)}
                />
            )}
            <Input
                label="Địa chỉ"
                placeholder="Số nhà, ngõ, đường..."
                value={values.address}
                onChange={e => set("address", e.target.value)}
            />
            <TextArea
                label="Ghi chú"
                placeholder="Ghi chú thêm (nếu có)"
                value={values.note}
                onChange={e => set("note", e.target.value)}
            />
            <NeighborhoodPickerSheet
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                onSelect={cluster => set("cluster", cluster)}
            />
        </Box>
    );
};

export default HouseForm;
