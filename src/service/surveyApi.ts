import { API } from "@constants/common";
import { PaginatedData, Survey } from "@dts";
import { request } from "./request";

export const fetchSurveys = (
    openOnly = false,
): Promise<PaginatedData<Survey>> =>
    request<PaginatedData<Survey>>(
        "GET",
        API.SURVEYS,
        { openOnly: openOnly ? 1 : undefined },
        { useAuth: false },
    );

export const fetchSurveyDetail = (id: string): Promise<Survey> =>
    request<Survey>("GET", `${API.SURVEYS}/${id}`, undefined, {
        useAuth: false,
    });

export interface SurveyAnswerInput {
    questionId: string;
    selectedOptions?: string[];
    otherText?: string;
}

export const respondToSurvey = (
    id: string,
    answers: SurveyAnswerInput[],
): Promise<unknown> =>
    request("POST", `${API.SURVEYS}/${id}/respond`, { answers });
