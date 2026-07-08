export { default as RequireAuth } from "./RequireAuth";
export { default as RequireRole } from "./RequireRole";

export const STAFF_ROLES = [
    "admin",
    "neighborhood_leader",
    "secretary",
    "regional_police",
    "people_committee_official",
] as const;
