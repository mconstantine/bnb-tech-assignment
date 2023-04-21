import { createSlice } from "@reduxjs/toolkit";
import {
  NetworkState,
  makeNetworkReducers,
  sendNetworkRequest,
} from "../network";
import { AppThunk, RootState } from "../../app/store";
import { env } from "../../env";
import { ServerError } from "../../ServerError";

export const productStatusProcessing = "Processing";
export const productStatusDone = "Done";

export type ProductStatus =
  | typeof productStatusProcessing
  | typeof productStatusDone;

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  status: ProductStatus;
}

type ProductListState = NetworkState<Product[]>;

export const productListSlice = createSlice({
  name: "productList",
  initialState: { status: "loading" } as ProductListState,
  reducers: {
    ...makeNetworkReducers<Product[]>(),
    // TODO:
    // updateOrder: (state: OrderListState, action: PayloadAction<Order>) => {
    //   return mapNetworkState(state, (orderList) =>
    //     orderList.map((order) => {
    //       if (order.id === action.payload.id) {
    //         return action.payload;
    //       } else {
    //         return order;
    //       }
    //     })
    //   );
    // },
  },
});

export const selectProductList = (state: RootState) => state.productList;
export const productListReducer = productListSlice.reducer;
export const productListActions = productListSlice.actions;
// export const { updateProduct } = productListSlice.actions;

export const fetchProductList = (): AppThunk<void> => async (dispatch) => {
  dispatch(productListActions.isLoading());

  try {
    const productList = await sendNetworkRequest<Product[]>({
      path: `/customers/${env.VITE_MOCK_CUSTOMER_ID}/orders/`,
      method: "GET",
    });

    dispatch(productListActions.didSucceed(productList));
  } catch (e) {
    const code: number = e instanceof ServerError ? e.code : 500;
    dispatch(productListActions.didFail(code));
  }
};
