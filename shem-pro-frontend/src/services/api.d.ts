import { AxiosInstance } from 'axios';

export declare const getLiveSensorData: () => Promise<any>;
export declare const getHistoryData: () => Promise<any>;
export declare const getSevenDayHistoryData: () => Promise<any>;
export declare const getEsp32LatestData: () => Promise<any>;

declare const api: AxiosInstance;
export default api;