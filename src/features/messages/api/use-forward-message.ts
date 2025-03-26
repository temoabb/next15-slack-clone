import { useCallback, useMemo, useState } from "react";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  body?: string;
  workspaceId: Id<"workspaces">;

  forwardingMessage: {
    id: Id<"messages">;
    authorMemberId: Id<"members">;
  };

  destination: {
    memberId?: Id<"members">;
    channelId?: Id<"channels">;
  };
};

type ResponseType = Id<"messages"> | null;

export type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useForwardMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutationFn = useMutation(api.messages.forward);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutationFn(values);
        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) throw error;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutationFn]
  );

  return {
    mutate,
    data,
    isSuccess,
    isError,
    isPending,
    error,
    isSettled,
  };
};
