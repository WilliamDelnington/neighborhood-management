declare module "*.jpg";
declare module "*.png";
declare module "*.pdf";

interface Window {
    isBack?: boolean;
    APP_ID?: string;
    APP_CONFIG?: Record<string, unknown>;
}
