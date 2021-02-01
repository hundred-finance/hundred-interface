import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";

import Aux from "./hoc/_Aux";

import "./App.css"

import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop"

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function App() {
  function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  const layout = Loadable({
    loader: () => import("./components/AdminLayout"),
    loading: Loader,
  });

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader/>}>
            <Switch>
              <Route path="/" component={layout}/>
            </Switch>
          </Suspense>
        </ScrollToTop>
      </Aux>
    </Web3ReactProvider>
  );
}

export default App;