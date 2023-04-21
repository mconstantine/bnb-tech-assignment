import "./App.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { OrderList } from "./features/order/OrderList";

export function App() {
  return (
    <Provider store={store}>
      <OrderList />
    </Provider>
  );
}
