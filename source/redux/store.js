import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./index";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "@react-native-community/async-storage";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(
  {
    ...persistConfig,
    blacklist: ["rooms", "nav", "apollo"],
    whitelist: ["profiles"]
  },

  rootReducer
);

const configureStore = initialState => {
  const middleware = applyMiddleware(thunk, logger);

  const store = createStore(persistedReducer, initialState, middleware);
  const persistor = persistStore(store);
  return {
    store,
    persistor
  };
};

export default configureStore;
