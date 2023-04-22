import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Order,
  fetchOrderList,
  selectOrderList,
  updateOrder,
} from "./orderListSlice";
import {
  ListItemState,
  NetworkList,
  NetworkListItemState,
  SublistItem,
} from "../../components/NetworkList";
import { sendNetworkRequest } from "../network";
import { formatDate } from "../../formatUtils";
import {
  Product,
  ProductStatus,
  updateProduct,
} from "../product/productListSlice";
import { NumberInput } from "../../components/NumberInput";
import { Dispatch, FormEventHandler, SetStateAction } from "react";
import { UpdateProductInput } from "../product/api";

export function OrderList() {
  const state = useAppSelector(selectOrderList);
  const dispatch = useAppDispatch();

  const fetchOrders = () => {
    dispatch(fetchOrderList());
  };

  const sendOrderUpdateOrderRequest = (order: Order) =>
    sendNetworkRequest<Order>({
      path: `/orders/${order.id}/done/`,
      method: "PATCH",
    });

  const onOrderUpdate = (order: Order) => {
    dispatch(updateOrder(order));
  };

  const sendProductUpdateRequest = (product: Product) =>
    sendNetworkRequest<UpdateProductInput, Product>({
      path: `/products/${product.id}/`,
      method: "PATCH",
      input: {
        status: product.status,
        quantity: product.quantity,
      },
    });

  const onProductUpdate = (product: Product) => {
    dispatch(updateProduct(product));
  };

  const getOrderLabel = (state: ListItemState<Order>) => {
    switch (state.networkState.status) {
      case "loading":
        return "Saving…";
      case "failure":
        return `Error (code ${state.networkState.code})`;
      case "ready": {
        const status = getOrderStatus(state.currentValue);
        const date = formatDate(new Date(state.currentValue.createdAt));
        return `${date} (${status})`;
      }
    }
  };

  const renderCommands = (state: ListItemState<Order>) => {
    const status: ProductStatus = getOrderStatus(state.currentValue);
    const isUIDisabled = state.networkState.status === "loading";
    const isSetAsDoneButtonDisabled = status === "Done";

    return (
      <input
        type="submit"
        value="Set as done"
        disabled={isUIDisabled || isSetAsDoneButtonDisabled}
      />
    );
  };

  const renderSublist = (
    state: ListItemState<Order>,
    setState: Dispatch<SetStateAction<ListItemState<Order>>>
  ): SublistItem<Product>[] =>
    state.currentValue.Products.map((product) => {
      const renderCommands = (networkState: NetworkListItemState) => {
        const isUIDisabled = networkState.status === "loading";

        const onQuantityChange = (quantity: number) => {
          setState((state) => ({
            ...state,
            currentValue: {
              ...state.currentValue,
              Products: state.currentValue.Products.map((p) => {
                if (p.id === product.id) {
                  return { ...p, quantity };
                } else {
                  return p;
                }
              }),
            },
          }));
        };

        const onStatusChange: FormEventHandler<HTMLSelectElement> = (event) => {
          const status = event.currentTarget.value as ProductStatus;

          setState((state) => ({
            ...state,
            currentValue: {
              ...state.currentValue,
              Products: state.currentValue.Products.map((p) => {
                if (p.id === product.id) {
                  return { ...p, status };
                } else {
                  return p;
                }
              }),
            },
          }));
        };

        return (
          <>
            <select value={product.status} onChange={onStatusChange}>
              {Object.entries(ProductStatus).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <NumberInput
              count={product.quantity}
              min={1}
              onChange={onQuantityChange}
              disabled={isUIDisabled}
            />
            <input type="submit" value="Save" disabled={isUIDisabled} />
          </>
        );
      };

      return {
        subject: product,
        getLabel: (product) => product.name,
        sendUpdateItemRequest: sendProductUpdateRequest,
        onSuccessfulUpdate: onProductUpdate,
        renderCommands,
      };
    });

  return (
    <NetworkList
      title="Your Orders"
      state={state}
      getLabel={getOrderLabel}
      fetchItems={fetchOrders}
      sendUpdateItemRequest={sendOrderUpdateOrderRequest}
      onSuccessfulUpdate={onOrderUpdate}
      renderCommands={renderCommands}
      renderSublist={renderSublist}
    />
  );
}

function getOrderStatus(order: Order): ProductStatus {
  if (order.Products.some((product) => product.status === "Processing")) {
    return ProductStatus.Processing;
  } else {
    return ProductStatus.Done;
  }
}
