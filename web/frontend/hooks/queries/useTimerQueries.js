import { useQuery } from "react-query";
import { fetchTimers } from "../../services/timerApi";
import { QUERY_KEYS } from "../../../constants/queryKeys";

export const useFetchTimers = ({ search = "" }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMERS_LIST, search],
    queryFn: () => fetchTimers(search),
    refetchOnWindowFocus: false,
  });
};
