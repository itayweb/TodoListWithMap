import type { User } from "~/types";
import api from "./api";

export const getUser = async () => {
    const response = await api.get("/auth/user");
    return response.data;
}