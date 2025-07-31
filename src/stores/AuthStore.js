import { create } from "zustand";
import { getToken, removeStoragePropFromObject } from "../utils/Utils";

const useAuthStore = create((set) => ({
  userToken: null,
  login: async () => {
    const token = await getToken("configuration");
    set({ userToken: token.encodetoken });
  },
  logout: async () => {
    await removeStoragePropFromObject("configuration", "encodetoken");
    set({ userToken: null });
  },
}));

export default useAuthStore;
