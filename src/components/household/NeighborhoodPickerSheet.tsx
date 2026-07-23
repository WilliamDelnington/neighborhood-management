import React, { useEffect, useState } from "react";
import { Box, Sheet, Text } from "zmp-ui";
import { LoadingState, EmptyState } from "@components/admin";
import { fetchNeighborhoods } from "@service/neighborhoodApi";

export interface NeighborhoodPickerSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (neighborhood: string) => void;
}

const NeighborhoodPickerSheet: React.FC<NeighborhoodPickerSheetProps> = ({
    visible,
    onClose,
    onSelect,
}) => {
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        fetchNeighborhoods()
            .then(setItems)
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [visible]);

    return (
        <Sheet
            visible={visible}
            onClose={onClose}
            title="Chọn tổ dân phố"
            autoHeight
            mask
        >
            <Box p={4} style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loading && <LoadingState />}
                {!loading && items.length === 0 && (
                    <EmptyState label="Chưa có tổ dân phố nào" />
                )}
                {!loading &&
                    items.map(neighborhood => (
                        <Box
                            key={neighborhood}
                            p={3}
                            mb={2}
                            className="bg-ng_10 rounded-xl"
                            onClick={() => {
                                onSelect(neighborhood);
                                onClose();
                            }}
                        >
                            <Text size="small">{neighborhood}</Text>
                        </Box>
                    ))}
            </Box>
        </Sheet>
    );
};

export default NeighborhoodPickerSheet;
