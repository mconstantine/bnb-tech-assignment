import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  NetworkState,
  makeNetworkReducers,
  sendNetworkRequest,
  mapNetworkState,
} from "../utils";
import { AppThunk, RootState } from "../../app/store";
import { env } from "../../env";
import { ServerError } from "../../ServerError";

export const OrderStatusProcessing = "Processing";
export const OrderStatusDone = "Done";

export type OrderStatus = typeof OrderStatusProcessing | typeof OrderStatusDone;

export interface Order {
  id: number;
  status: OrderStatus;
  createdAt: string;
}

type OrderListState = NetworkState<Order[]>;

export const orderListSlice = createSlice({
  name: "orderList",
  initialState: { status: "loading" } as OrderListState,
  reducers: {
    ...makeNetworkReducers<Order[]>(),
    updateOrder: (state: OrderListState, action: PayloadAction<Order>) => {
      return mapNetworkState(state, (orderList) =>
        orderList.map((order) => {
          if (order.id === action.payload.id) {
            return action.payload;
          } else {
            return order;
          }
        })
      );
    },
  },
});

export const selectOrderList = (state: RootState) => state.orderList;
export const orderListReducer = orderListSlice.reducer;
export const orderListActions = orderListSlice.actions;
export const { updateOrder } = orderListSlice.actions;

export const fetchOrderList = (): AppThunk<void> => async (dispatch) => {
  dispatch(orderListActions.isLoading());

  try {
    const orderList = await sendNetworkRequest<Order[]>({
      path: `/customers/${env.VITE_MOCK_CUSTOMER_ID}/orders/`,
      method: "GET",
    });

    dispatch(orderListActions.didSucceed(orderList));
  } catch (e) {
    const code: number = e instanceof ServerError ? e.code : 500;
    dispatch(orderListActions.didFail(code));
  }
};
