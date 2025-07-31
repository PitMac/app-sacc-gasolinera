import { create } from "zustand";

export const useModalStore = create((set) => ({
  modalProps: null,
  resolvePromise: null,

  showModal: (props) =>
    new Promise((resolve) => {
      set({ modalProps: props, resolvePromise: resolve });
    }),

  hideModal: (result) =>
    set((state) => {
      if (state.resolvePromise) {
        state.resolvePromise(result);
      }
      return { modalProps: null, resolvePromise: null };
    }),
}));
