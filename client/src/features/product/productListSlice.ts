import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  NetworkState,
  makeNetworkReducers,
  mapNetworkState,
  sendNetworkRequest,
} from "../network";
import { AppThunk, RootState } from "../../app/store";
import { env } from "../../env";
import { ServerError } from "../../ServerError";

export enum ProductStatus {
  Processing = "Processing",
  Done = "Done",
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  status: ProductStatus;
  OrderId: number;
  Order: {
    createdAt: string;
  };
}

type ProductListState = NetworkState<Product[]>;

export const productListSlice = createSlice({
  name: "productList",
  initialState: { status: "loading" } as ProductListState,
  reducers: {
    ...makeNetworkReducers<Product[]>(),
    updateProduct: (
      state: ProductListState,
      action: PayloadAction<Product>
    ) => {
      return mapNetworkState(state, (product) =>
        product.map((product) => {
          if (product.id === action.payload.id) {
            return action.payload;
          } else {
            return product;
          }
        })
      );
    },
  },
});

export const selectProductList = (state: RootState) => state.productList;
export const productListReducer = productListSlice.reducer;
export const productListActions = productListSlice.actions;
export const { updateProduct } = productListSlice.actions;

export const fetchProductList = (): AppThunk<void> => async (dispatch) => {
  dispatch(productListActions.isLoading());

  try {
    const productList = await sendNetworkRequest<Product[]>({
      path: `/customers/${env.VITE_MOCK_CUSTOMER_ID}/products/`,
      method: "GET",
    });

    dispatch(productListActions.didSucceed(productList));
  } catch (e) {
    const code: number = e instanceof ServerError ? e.code : 500;
    dispatch(productListActions.didFail(code));
  }
};
