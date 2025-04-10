import API from "./APIService";

export interface Task {
    id: string;
    platform: string;
    description: string;
    coins: number;
    icon: string;
    link: string;
    completed: boolean;
  }
  
  export interface TaskResponse {
    dailyTasks: Task[];
    weeklyTasks: Task[];
    monthlyTasks: Task[];
  }

export const getInviteId = async (telegramUserId: string): Promise<string> => {
    const response = await API.post("/api/invite", {}, {
      headers: {
        "telegram-id": telegramUserId,
      },
    });
  
    if (response.data?.status && response.data?.data) {
      return response.data.data;
    } else {
      throw new Error(response.data?.error || "Failed to get invite ID");
    }
  };


  export const getTasks = async (telegramUserId: string): Promise<TaskResponse> => {
    const response = await API.get("/api/tasks", {
      headers: {
        "telegram-id": telegramUserId,
      },
    });
  
    if (response.data?.data?.success === false) {
      throw new Error(response.data?.error || "Failed to fetch tasks");
    }
  
    return {
      dailyTasks: response.data.data.dailyTasks || [],
      weeklyTasks: response.data.data.weeklyTasks || [],
      monthlyTasks: response.data.data.monthlyTasks || [],
    };
  };
  
  export const completeTaskAPI = async (
    telegramUserId: string,
    taskId: string,
    taskType: string,
    points: number
  ): Promise<void> => {
    const response = await API.post(
      "/api/completeTask",
      { taskId, taskType, points },
      {
        headers: {
          "Content-Type": "application/json",
          "telegram-id": telegramUserId,
        },
      }
    );
  
    if (!response.data?.status) {
      throw new Error(response.data?.error || "Failed to complete task");
    }
  };