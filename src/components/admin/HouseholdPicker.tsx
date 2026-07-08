import React, { useEffect, useState } from "react";
import { Box, Sheet, Text } from "zmp-ui";
import { Input } from "@components/customized";
import { Household } from "@dts";
import { fetchHouseholds } from "@service/householdApi";
import ListRow from "./ListRow";
import { LoadingState, EmptyState, ErrorState } from "./States";

export interface HouseholdPickerProps {
    /** Nhan hien thi cho o chon (mac dinh "Ho dan"). */
    label?: string;
    /** householdId dang duoc chon, dung de highlight/hien thi khi chua co du lieu ho day du. */
    value?: string;
    /** Nhan hien thi san cho gia tri dang chon, vi du khi sua ban ghi da co ho dan lien ket. */
    valueLabel?: string;
    onChange: (householdId: string, household: Household) => void;
    disabled?: boolean;
}

/**
 * O chon ho dan dung chung cho cac form Nhan khau / PCCC / An ninh: bam vao mo Sheet
 * tim kiem theo ma ho/chu ho/dia chi, cham vao mot dong de chon.
 */
const HouseholdPicker: React.FC<HouseholdPickerProps> = ({
    label = "Hộ dân",
    value,
    valueLabel,
    onChange,
    disabled,
}) => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<Household[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pickedLabel, setPickedLabel] = useState(valueLabel || "");

    useEffect(() => {
        setPickedLabel(valueLabel || "");
    }, [valueLabel, value]);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchHouseholds({ search, limit: 20 })
            .then(res => setItems(res.items))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!visible) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, search]);

    const handlePick = (household: Household) => {
        setPickedLabel(`${household.code} — ${household.address}`);
        onChange(household._id, household);
        setVisible(false);
    };

    return (
        <Box>
            <Text size="xSmall" className="text-text_2 mb-1">
                {label}
            </Text>
            <Box
                className={`rounded-lg px-3 py-3 ${
                    disabled ? "bg-ng_10 opacity-60" : "bg-ng_10"
                }`}
                onClick={() => !disabled && setVisible(true)}
            >
                <Text size="small" className={pickedLabel ? "" : "text-text_3"}>
                    {pickedLabel || "Chọn hộ dân..."}
                </Text>
            </Box>

            <Sheet
                visible={visible}
                onClose={() => setVisible(false)}
                title="Chọn hộ dân"
                height="80vh"
                autoHeight={false}
            >
                <Box
                    p={4}
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Input
                        placeholder="Tìm theo mã hộ, chủ hộ, địa chỉ..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Box style={{ flex: 1, overflowY: "auto", marginTop: 12 }}>
                        {loading && <LoadingState />}
                        {!loading && error && <ErrorState onRetry={load} />}
                        {!loading && !error && items.length === 0 && (
                            <EmptyState label="Không tìm thấy hộ dân phù hợp" />
                        )}
                        {!loading &&
                            !error &&
                            items.map(h => (
                                <ListRow
                                    key={h._id}
                                    title={`${h.code} — ${h.headOfHousehold}`}
                                    subtitle={h.address}
                                    onClick={() => handlePick(h)}
                                />
                            ))}
                    </Box>
                </Box>
            </Sheet>
        </Box>
    );
};

export default HouseholdPicker;
