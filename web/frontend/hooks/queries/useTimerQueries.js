import { useQuery } from "react-query";
import { fetchTimerById, fetchTimers } from "../../services/timerApi";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const useFetchTimers = ({ search = "" }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMERS_LIST, search],
    queryFn: () => fetchTimers(search),
    refetchOnWindowFocus: false,
  });
};

export const useFetchTimerById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ONE_TIMER, id],
    queryFn: () => fetchTimerById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
