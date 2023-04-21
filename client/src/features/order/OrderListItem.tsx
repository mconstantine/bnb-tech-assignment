import "./OrderListItem.css";
import { FormEventHandler, useState } from "react";
import { formatDateTime } from "../../formatUtils";
import { Order, updateOrder } from "./orderListSlice";
import { NetworkState, sendNetworkRequest } from "../utils";
import { ServerError } from "../../ServerError";
import { useAppDispatch } from "../../app/hooks";

interface Props {
  order: Order;
}

export function OrderListItem(props: Props) {
  const dispatch = useAppDispatch();

  const [state, setState] = useState<NetworkState<Order>>({
    status: "success",
    data: props.order,
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setState({ status: "loading" });

    try {
      const data = await sendNetworkRequest<Order>({
        path: `/orders/${props.order.id}/done/`,
        method: "PATCH",
      });

      setState({ status: "success", data });
      dispatch(updateOrder(data));
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
    switch (state.status) {
      case "loading":
        return "Saving…";
      case "failure":
        return `Error (code ${state.code})`;
      case "success":
        return formatDateTime(new Date(state.data.createdAt));
    }
  })();

  const isUIDisabled = state.status === "loading";

  return (
    <div className="OrderListItem" role="listitem">
      <p>{label}</p>
      <form onSubmit={onSubmit}>
        <input type="submit" value="Set as done" disabled={isUIDisabled} />
      </form>
    </div>
  );
}
