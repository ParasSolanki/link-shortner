export function useMutation(
  handler: (data: any) => any,
  callbacks?: {
    onError?: (error: any) => void;
    onSuccess?: (data: ReturnType<typeof handler>) => void;
  }
) {
  const isPending = ref(false);
  const isError = ref(false);
  const error = ref(undefined);

  async function mutateAsync(variables: any) {
    error.value = undefined;
    isError.value = false;
    isPending.value = true;

    try {
      const data = await handler(variables);

      callbacks?.onSuccess?.(data);
      return data;
    } catch (e) {
      error.value = e;
      isError.value = true;
      callbacks?.onError?.(e);
    } finally {
      isPending.value = false;
    }
  }

  function mutate(variables: any) {
    error.value = undefined;
    isError.value = false;
    isPending.value = true;

    handler(variables)
      .then((d) => {
        callbacks?.onSuccess?.(d);
      })
      .catch((e) => {
        error.value = e;
        callbacks?.onError?.(e);
        isError.value = true;
      })
      .finally(() => {
        isPending.value = false;
      });
  }

  return {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  };
}
