import "./OrderListItem.css";
import { FormEventHandler, useState } from "react";
import { formatDateTime } from "../../formatUtils";
import {
  Order,
  OrderStatus,
  OrderStatusDone,
  OrderStatusProcessing,
  updateOrder,
} from "./orderListSlice";
import { NetworkState } from "../utils";
import { ServerError } from "../../ServerError";
import { useAppDispatch } from "../../app/hooks";
import { makeSendUpdateOrderRequest } from "./api";

interface Props {
  order: Order;
}

interface State {
  currentValue: Order;
  networkState: NetworkState<Order>;
  didChange: boolean;
}

export function OrderListItem(props: Props) {
  const dispatch = useAppDispatch();

  const [state, setState] = useState<State>({
    currentValue: props.order,
    networkState: {
      status: "success",
      data: props.order,
    },
    didChange: false,
  });

  const sendUpdateOrderRequest = makeSendUpdateOrderRequest(props.order.id);

  const onStatusChange: FormEventHandler<HTMLSelectElement> = (event) => {
    const status = event.currentTarget.value as OrderStatus;

    setState((state) => ({
      ...state,
      currentValue: {
        ...state.currentValue,
        status,
      },
      didChange: true,
    }));
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setState((state) => ({
      ...state,
      networkState: { status: "loading" },
    }));

    try {
      const data = await sendUpdateOrderRequest({
        status: state.currentValue.status,
      });

      dispatch(updateOrder(data));

      setState({
        currentValue: data,
        networkState: { status: "success", data },
        didChange: false,
      });
    } catch (e) {
      if (e instanceof ServerError) {
        const serverError = e as ServerError;
        setState((state) => ({
          ...state,
          networkState: { status: "failure", code: serverError.code },
        }));
      } else {
        setState((state) => ({
          ...state,
          networkState: { status: "failure", code: 500 },
        }));
      }
    }
  };

  const label = (() => {
    switch (state.networkState.status) {
      case "loading":
        return "Saving…";
      case "failure":
        return `Error (code ${state.networkState.code})`;
      case "success":
        return formatDateTime(new Date(state.networkState.data.createdAt));
    }
  })();

  const isUIDisabled = state.networkState.status === "loading";
  const isSaveButtonDisabled = !state.didChange;

  return (
    <div className="OrderListItem" role="listitem">
      <p>{label}</p>
      <form onSubmit={onSubmit}>
        <select
          value={state.currentValue.status}
          onChange={onStatusChange}
          disabled={isUIDisabled}
        >
          <option value={OrderStatusProcessing}>{OrderStatusProcessing}</option>
          <option value={OrderStatusDone}>{OrderStatusDone}</option>
        </select>
        <input
          type="submit"
          value="Save"
          disabled={isUIDisabled || isSaveButtonDisabled}
        />
      </form>
    </div>
  );
}
