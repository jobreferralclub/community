import { create } from "zustand";

const useTemplateStore = create((set) => ({
  currentTemplate: null,
  setCurrentTemplate: (template) => set({ currentTemplate: template }),
}));

export default useTemplateStore;
