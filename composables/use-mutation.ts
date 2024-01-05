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
  const data = ref(undefined);

  async function mutateAsync(variables: any) {
    error.value = undefined;
    isError.value = false;
    isPending.value = true;
    data.value = undefined;

    try {
      const response = await handler(variables);
      data.value = response;
      callbacks?.onSuccess?.(response);
      return response;
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
    data.value = undefined;

    handler(variables)
      .then((d) => {
        data.value = d;
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
    data,
  };
}
