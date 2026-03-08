import { useQuery } from "react-query";
import { fetchTimerById, fetchTimers } from "../../services/timerApi";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const useFetchTimers = ({ search = "", sort = "asc", shouldHideExpired = false }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMERS_LIST, search, sort, shouldHideExpired],
    queryFn: () => fetchTimers(search, sort, shouldHideExpired),
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
