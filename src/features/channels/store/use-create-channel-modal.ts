import { atom, useAtom } from "jotai";

const modalState = atom(false);

const useCreateChannelModal = () => {
  return useAtom(modalState);
};

export default useCreateChannelModal;
