import { AnyAction, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { orderListReducer } from "../features/order/orderListSlice";
import { pageReducer } from "../features/page/pageSlice";
import { productListReducer } from "../features/product/productListSlice";

export const store = configureStore({
  reducer: {
    orderList: orderListReducer,
    productList: productListReducer,
    page: pageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<T> = ThunkAction<T, RootState, unknown, AnyAction>;
