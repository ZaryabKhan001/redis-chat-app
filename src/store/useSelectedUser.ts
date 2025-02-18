import { create } from "zustand";
import { User } from "@/db/dummy";

type selectedUserType = {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
};

export const useSelectedUser = create<selectedUserType>((set) => ({
  selectedUser: null,

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },
}));
