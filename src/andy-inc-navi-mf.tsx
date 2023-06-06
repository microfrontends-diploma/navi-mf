import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from ".";
import { ApiProvider } from "./context/ApiContext";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: () => (
    <ApiProvider>
      <Root/>
    </ApiProvider>
    ),
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
