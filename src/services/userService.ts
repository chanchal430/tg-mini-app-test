import API, { APIResponse } from "../services/APIService";

export interface UserData {
    tapPoints?: number;
    taskPoints?: number;
    totalPoints?: number;
    firstName?: string;
    lastName?: string;
}

export const getUserData = async (telegramUserId: string): Promise<UserData> => {
    const response = await API.get<APIResponse<UserData>>("/api/user", {
        headers: { "telegram-id": telegramUserId },
    });
    return response.data.data;
};

export const saveTelegramId = async (telegramUserId: string): Promise<void> => {
    await API.post("/api/save-telegram-id", { telegramUserId });
};

export const connectWallet = async (walletAddress: string): Promise<any> => {
    const response = await API.post("/api/connectWallet", { walletAddress });
    return response.data;
};

export const updateTapPoints = async (
    telegramUserId: string,
    points: number
): Promise<{ updatedTapPoints: number; updatedTotalPoints: number }> => {
    const response = await API.post("/api/updateTapPoints", { points }, {
        headers: { "telegram-id": telegramUserId },
    });
    return response.data;
};
