import { useMutation, useQueryClient } from "react-query";
import { createTimer, deleteTimer, updateTimer } from "../../services/timerApi";
import { QUERY_KEYS } from "../../../constants/queryKeys";

export const useCreateTimer = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimer,

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries([QUERY_KEYS.TIMERS_LIST]);
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error(error);
      onError?.(error, variables, context);
    },
  });
};

export const useUpdateTimer = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimer,

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries([QUERY_KEYS.TIMERS_LIST]);
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ONE_TIMER, variables.id],
        data,
      );
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error(error);
      onError?.(error, variables, context);
    },
  });
};

export const useDeleteTimer = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimer,

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries([QUERY_KEYS.TIMERS_LIST]);
      queryClient.removeQueries(
        [QUERY_KEYS.GET_ONE_TIMER, variables.id]
      );
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error(error);
      onError?.(error, variables, context);
    },
  });
};
