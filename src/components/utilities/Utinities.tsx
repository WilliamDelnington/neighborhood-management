import React, { FunctionComponent } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Background from "@assets/background.png";
import UtinityItem, { UtinityItemProps } from "./UtilityItem";

interface UtinitiesProps {
    utinities: UtinityItemProps & { key: string }[];
}

const UtinitiesWrapper = styled.div`
    ${tw`bg-ui_bg bg-center bg-no-repeat`};
    background-image: url(${Background});
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 16px;
    padding-top: 24px;
`;
const Utinities: FunctionComponent<UtinitiesProps> = props => {
    const { utinities } = props;
    return (
        <UtinitiesWrapper>
            {utinities.map(item => {
                const { key, ...utinity } = item;
                return <UtinityItem key={key} {...utinity} />;
            })}
        </UtinitiesWrapper>
    );
};

export default Utinities;
