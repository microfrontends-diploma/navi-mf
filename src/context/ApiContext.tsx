import { createContext, useContext } from "react";
import { Api } from "../api";
import { AbstractComponentProps } from "src/typings/global";

export const api = new Api();
const apiContext = createContext(api);

export const useApi = () => useContext(apiContext);

// FIXME: пофиксить эту историю с глобальными типами
export const ApiProvider = ({ children }: AbstractComponentProps) => <apiContext.Provider value={api}>{children}</apiContext.Provider>;
