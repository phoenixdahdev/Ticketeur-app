import { get_my_events } from "./action"
import { useQuery } from "@tanstack/react-query"

export const useMyEventQuery = () => {
    return useQuery({
        queryKey: ["my-events"],
        queryFn: async () => await get_my_events()
    })
}