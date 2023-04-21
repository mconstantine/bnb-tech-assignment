import "./OrderListItem.css";
import { FormEventHandler, useState } from "react";
import { formatDateTime } from "../../formatUtils";
import { Order, updateOrder } from "./orderListSlice";
import { NetworkState, sendNetworkRequest } from "../utils";
import { ServerError } from "../../ServerError";
import { useAppDispatch } from "../../app/hooks";
import { ProductStatus } from "../product/productListSlice";

interface Props {
  order: Order;
}

export function OrderListItem(props: Props) {
  const dispatch = useAppDispatch();

  const [networkStatus, setNetworkStatus] = useState<NetworkState<null>>({
    status: "success",
    data: null,
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setNetworkStatus({ status: "loading" });

    try {
      const data = await sendNetworkRequest<Order>({
        path: `/orders/${props.order.id}/done/`,
        method: "PATCH",
      });

      setNetworkStatus({ status: "success", data: null });
      dispatch(updateOrder(data));
    } catch (e) {
      if (e instanceof ServerError) {
        const serverError = e as ServerError;
        setNetworkStatus((state) => ({
          ...state,
          networkState: { status: "failure", code: serverError.code },
        }));
      } else {
        setNetworkStatus((state) => ({
          ...state,
          networkState: { status: "failure", code: 500 },
        }));
      }
    }
  };

  const label = (() => {
    switch (networkStatus.status) {
      case "loading":
        return "Saving…";
      case "failure":
        return `Error (code ${networkStatus.code})`;
      case "success":
        return formatDateTime(new Date(props.order.createdAt));
    }
  })();

  const status: ProductStatus = (() => {
    if (
      props.order.Products.some((product) => product.status === "Processing")
    ) {
      return "Processing";
    } else {
      return "Done";
    }
  })();

  const isUIDisabled = networkStatus.status === "loading";
  const isSetAsDoneButtonDisabled = status === "Done";

  return (
    <div className="OrderListItem" role="listitem">
      <p>
        {label} ({status})
      </p>
      <form onSubmit={onSubmit}>
        <input
          type="submit"
          value="Set as done"
          disabled={isUIDisabled || isSetAsDoneButtonDisabled}
        />
      </form>
    </div>
  );
}
