import { useSelector } from "react-redux";
import "./App.css";
import { OrderList } from "./features/order/OrderList";
import { Page, selectPage } from "./features/page/pageSlice";
import { Header } from "./components/Header";
import { ProductList } from "./features/product/ProductList";

export function App() {
  const page = useSelector(selectPage);

  const pageComponent = (() => {
    switch (page) {
      case Page.Orders:
        return <OrderList />;
      case Page.Products:
        return <ProductList />;
    }
  })();

  return (
    <>
      <header>
        <Header />
      </header>
      <main>{pageComponent}</main>
    </>
  );
}
