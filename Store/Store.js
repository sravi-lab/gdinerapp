import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import Appdataslice from "./Appdataslice";
import Dinerdataslice from "./Dinerdataslice";

// Persist config only for `appdata`
const appdataPersistConfig = {
  key: "appdata",
  storage: AsyncStorage,
};

// Persist only `appdata`
const persistedAppdataReducer = persistReducer(appdataPersistConfig, Appdataslice);

 const rootReducer = combineReducers({
  appdata: persistedAppdataReducer,   
  dinerdata: Dinerdataslice,   
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
