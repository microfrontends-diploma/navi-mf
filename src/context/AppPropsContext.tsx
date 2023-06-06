import { createContext, useContext } from "react";
import { AppProps } from "single-spa";
import { AbstractComponentProps } from "src/typings/global";

// TODO: общий модуль - его стоит выносить в пакет
const propsContext = createContext<AppProps>(null);

export const useAppProps = () => useContext(propsContext);

interface AppPropsProviderProps extends AbstractComponentProps {
  props: AppProps;
}

export const AppPropsProvider = ({ props, children }: AppPropsProviderProps) => (
  <propsContext.Provider value={props}>{children}</propsContext.Provider>
);
