import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchOrderList, selectOrderList } from "./orderListSlice";
import { NetworkState } from "../../components/NetworkState";
import { OrderListItem } from "./OrderListItem";

export function OrderList() {
  const state = useAppSelector(selectOrderList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOrderList());
  }, [dispatch]);

  return (
    <div className="OrderList">
      <h1>Your Orders</h1>
      <div role="list">
        <NetworkState
          state={state}
          dataHandler={(orders) => (
            <>
              {orders.map((order) => (
                <OrderListItem key={order.id} order={order} />
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
}
