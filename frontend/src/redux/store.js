import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import authReducer from "./slices/authSlice";
import plansReducer from "./slices/plansSlice";
import bookingsReducer from "./slices/bookingsSlice";
import emailVerificationReducer from "./slices/emailVerificationSlice";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    plans: plansReducer,
    bookings: bookingsReducer,
    emailVerification: emailVerificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

const persistor = persistStore(store);

export { persistor }; // Ensure persistor is exported
export default store;
