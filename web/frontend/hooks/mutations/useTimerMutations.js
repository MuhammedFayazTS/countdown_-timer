import { useMutation, useQueryClient } from "react-query";
import { createTimer } from "../../services/timerApi";

export const useCreateTimer = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await createTimer(formData);

      if (!response.ok) {
        throw new Error("Failed to save timer");
      }

      return response.json();
    },

    onSuccess: async (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["timers"] });

      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error(error);
      onError?.(error, variables, context);
    },
  });
};
