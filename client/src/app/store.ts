import { AnyAction, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { orderListReducer } from "../features/order/orderListSlice";

export const store = configureStore({
  reducer: {
    orderList: orderListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<T> = ThunkAction<T, RootState, unknown, AnyAction>;
