import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import matchesReducer from './slices/matchesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    matches: matchesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling dates and complex objects
    }),
});
