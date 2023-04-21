import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export enum Page {
  Orders = "orders",
  Products = "products",
}

interface PageState {
  currentPage: Page;
}

export const pageSlice = createSlice({
  name: "page",
  initialState: { currentPage: "orders" } as PageState,
  reducers: {
    setPage: (_state: PageState, action: PayloadAction<Page>) => {
      return {
        currentPage: action.payload,
      };
    },
  },
});

export const selectPage = (state: RootState) => state.page.currentPage;
export const pageReducer = pageSlice.reducer;
export const { setPage } = pageSlice.actions;
