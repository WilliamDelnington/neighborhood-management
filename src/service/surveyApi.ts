import { API } from "@constants/common";
import { PaginatedData, Survey, SurveyQuestion } from "@dts";
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

export interface SurveyInput {
    title: string;
    description?: string;
    questions: Omit<SurveyQuestion, "_id">[];
    eligibleAll?: boolean;
    eligibleRoles?: string[];
    eligibleClusters?: string[];
}

export const createSurvey = (input: SurveyInput): Promise<Survey> =>
    request<Survey>("POST", API.SURVEYS, input);

export const updateSurvey = (
    id: string,
    input: Partial<SurveyInput>,
): Promise<Survey> => request<Survey>("PATCH", `${API.SURVEYS}/${id}`, input);

export const deleteSurvey = (id: string): Promise<null> =>
    request<null>("DELETE", `${API.SURVEYS}/${id}`);

export const openSurvey = (id: string): Promise<Survey> =>
    request<Survey>("POST", `${API.SURVEYS}/${id}/open`);

export const closeSurvey = (id: string): Promise<Survey> =>
    request<Survey>("POST", `${API.SURVEYS}/${id}/close`);

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

export interface SurveyResultItem {
    questionId: string;
    question: string;
    type: string;
    optionCounts: Record<string, number>;
    otherTexts: string[];
}

export interface SurveyResults {
    surveyId: string;
    title: string;
    totalResponses: number;
    results: SurveyResultItem[];
}

export const fetchSurveyResults = (id: string): Promise<SurveyResults> =>
    request<SurveyResults>("GET", `${API.SURVEYS}/${id}/results`);
