import "./OrderListItem.css";
import { FormEventHandler } from "react";
import { formatDateTime } from "../../formatUtils";
import {
  Order,
  OrderStatusDone,
  OrderStatusProcessing,
} from "./orderListSlice";

interface Props {
  order: Order;
}

export function OrderListItem(props: Props) {
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    console.log(event.currentTarget);
  };

  return (
    <div className="OrderListItem" role="listitem">
      <p>{formatDateTime(new Date(props.order.createdAt))}</p>
      <form onSubmit={onSubmit}>
        <select>
          <option value={OrderStatusProcessing}>{OrderStatusProcessing}</option>
          <option value={OrderStatusDone}>{OrderStatusDone}</option>
        </select>
        <input type="submit" value="Save" />
      </form>
    </div>
  );
}
