import React, { createContext, useReducer } from "react";

const initialState = {
  gasPrice: null,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "UPDATE_GAS_PRICE":
        return Object.assign({}, state, {
          gasPrice: action.gasPrice,
        });
      default:
        throw new Error("Unknown action type");
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
