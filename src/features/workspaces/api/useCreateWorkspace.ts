import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

type RequestType = { name: string };
type ResponseType = Id<"workspaces">;
// type ResponseType = Doc<"workspaces">;

export type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useCreateWorkspace = () => {
  // console.log("useCreateWorkspace");
  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: any, options?: Options) => {
      // console.log("callback");
      try {
        const response = await mutation(values);
        options?.onSuccess?.(response);
      } catch (error) {
        options?.onError?.(error as Error);
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    createWorkspace: mutate,
  };
};
