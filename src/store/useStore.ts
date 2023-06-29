import { useContext, createContext } from "react";
import rootStore from "./RootStore";

export const RootStoreContext = createContext(rootStore);
export const useStore = () => useContext(RootStoreContext);
