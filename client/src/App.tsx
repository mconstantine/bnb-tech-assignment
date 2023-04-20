import "./App.css";
import { Counter } from "./features/counter/Counter";
import { Provider } from "react-redux";
import { store } from "./app/store";

export function App() {
  return (
    <Provider store={store}>
      <div className="card">
        <Counter />
      </div>
    </Provider>
  );
}
