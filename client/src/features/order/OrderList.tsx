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
} from "../../components/NetworkList";
import { sendNetworkRequest } from "../network";
import { formatDate } from "../../formatUtils";
import { ProductStatus } from "../product/productListSlice";

export function OrderList() {
  const state = useAppSelector(selectOrderList);
  const dispatch = useAppDispatch();

  const fetchOrders = () => {
    dispatch(fetchOrderList());
  };

  const sendUpdateOrderRequest = (order: Order) =>
    sendNetworkRequest<Order>({
      path: `/orders/${order.id}/done/`,
      method: "PATCH",
    });

  const onOrderUpdate = (order: Order) => {
    dispatch(updateOrder(order));
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

  return (
    <NetworkList
      title="Your Orders"
      state={state}
      getLabel={getOrderLabel}
      fetchItems={fetchOrders}
      sendUpdateItemRequest={sendUpdateOrderRequest}
      onSuccessfulUpdate={onOrderUpdate}
      renderCommands={renderCommands}
    />
  );
}

function getOrderStatus(order: Order): ProductStatus {
  if (order.Products.some((product) => product.status === "Processing")) {
    return "Processing";
  } else {
    return "Done";
  }
}
