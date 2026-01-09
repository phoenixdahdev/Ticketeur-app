
"use server";

import { eventQueries, type EventStatus, type Event } from "@useticketeur/db";

export const getEvents = async (props?: {
    search?: string;
    status?: EventStatus;
    page?: number;
    limit?: number;
}): Promise<Event[]> => {
    try {
        const page = Math.max(1, props?.page || 1);
        const limit = Math.min(100, Math.max(1, props?.limit || 20));
        const offset = (page - 1) * limit;

        return await eventQueries.getEvents({
            search: props?.search,
            status: props?.status,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Failed to fetch events:", error);
        throw new Error("Failed to fetch events");
    }
};