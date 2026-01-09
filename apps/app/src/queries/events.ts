import { queryOptions } from "@tanstack/react-query"
import { getEvents } from "@/app/(home)/events/action";
import { type Event, type EventStatus } from "@useticketeur/db";

export const getEventsOptions = (props?: {
    search?: string;
    status?: EventStatus;
    page?: number;
    limit?: number;
}
) => {
    const { search, status, page = 1, limit = 20 } = props || {};

    return queryOptions({
        queryKey: ['events', { search, status, page, limit }],
        queryFn: async (): Promise<Event[]> => {
            try {
                return await getEvents({
                    search,
                    status,
                    page,
                    limit,
                });
            } catch (error) {
                throw new Error("Failed to fetch events");
            }
        },
    });
};