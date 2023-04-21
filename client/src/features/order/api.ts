import { makeNetworkRequest, sendNetworkRequest } from "../utils";
import { Order, OrderStatus } from "./orderListSlice";

interface UpdateOrderInput {
  status: OrderStatus;
}

export const makeSendUpdateOrderRequest = (id: number) => {
  const request = makeNetworkRequest<UpdateOrderInput>({
    path: `/orders/${id}/`,
    method: "PATCH",
  });

  return (input: UpdateOrderInput) =>
    sendNetworkRequest<UpdateOrderInput, Order>(request(input));
};
