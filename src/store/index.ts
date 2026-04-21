import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiService } from "@/services/apiService";

// Create the Redux store
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [apiService.reducerPath]: apiService.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'apiService/executeQuery/pending',
          'apiService/executeQuery/fulfilled',
          'apiService/executeQuery/rejected',
          'apiService/executeMutation/pending',
          'apiService/executeMutation/fulfilled',
          'apiService/executeMutation/rejected',
        ],
        ignoredActionPaths: [
          'meta.arg',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
          'payload.timestamp',
        ],
        ignoredPaths: ['apiService.queries', 'apiService.mutations'],
      },
    }).concat(apiService.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
