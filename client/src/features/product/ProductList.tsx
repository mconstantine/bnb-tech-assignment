import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ListItemState, NetworkList } from "../../components/NetworkList";
import { mapNetworkState, sendNetworkRequest } from "../network";
import {
  Product,
  ProductStatus,
  fetchProductList,
  selectProductList,
  updateProduct,
} from "./productListSlice";
import { formatDate } from "../../formatUtils";
import { SublistItem } from "../../components/NetworkList";
import { Dispatch, FormEventHandler, SetStateAction } from "react";
import { NetworkListItemState } from "../../components/NetworkList";
import { UpdateProductInput } from "./api";

// Products aggregated by SKU maintain an array of the original IDs and quanitites
interface AggregatedProduct extends Omit<Product, "id"> {
  originalData: Array<{
    id: number;
    quantity: number;
  }>;
}

interface ProductByOrder {
  id: number;
  orderDate: Date;
  products: AggregatedProduct[];
}

export function ProductList() {
  const productListState = useAppSelector(selectProductList);
  const dispatch = useAppDispatch();

  const productsByOrder = mapNetworkState(productListState, (products) =>
    products.reduce<ProductByOrder[]>((res, product) => {
      let didFindOrder = false;

      for (const order of res) {
        if (order.id === product.OrderId) {
          didFindOrder = true;
          let didFindProduct = false;

          for (const orderProduct of order.products) {
            if (orderProduct.sku === product.sku) {
              didFindProduct = true;

              orderProduct.originalData.push({
                id: product.id,
                quantity: product.quantity,
              });

              orderProduct.quantity += product.quantity;
              break;
            }
          }

          if (!didFindProduct) {
            order.products.push({
              ...product,
              originalData: [
                {
                  id: product.id,
                  quantity: product.quantity,
                },
              ],
            });
          }

          break;
        }
      }

      if (!didFindOrder) {
        res.push({
          id: product.OrderId,
          orderDate: new Date(product.Order.createdAt),
          products: [
            {
              ...product,
              originalData: [
                {
                  id: product.id,
                  quantity: product.quantity,
                },
              ],
            },
          ],
        });
      }

      return res;
    }, [])
  );

  const fetchProducts = () => {
    dispatch(fetchProductList());
  };

  const getOrderLabel = (state: ListItemState<ProductByOrder>) => {
    switch (state.networkState.status) {
      case "loading":
        return "Saving…";
      case "failure":
        return `Error (code ${state.networkState.code})`;
      case "ready": {
        return formatDate(state.currentValue.orderDate);
      }
    }
  };

  const sendUpdateProductRequest = (product: ProductByOrder) =>
    Promise.resolve(product);

  const onProductUpdate = () => {
    return;
  };

  const renderProductsList = (
    state: ListItemState<ProductByOrder>,
    setState: Dispatch<SetStateAction<ListItemState<ProductByOrder>>>
  ): SublistItem<AggregatedProduct>[] => {
    const sendUpdateProductsRequest = async (
      product: AggregatedProduct
    ): Promise<AggregatedProduct> => {
      const products = await Promise.all(
        product.originalData.map((originalData) =>
          sendNetworkRequest<UpdateProductInput, Product>({
            path: `/products/${originalData.id}`,
            method: "PATCH",
            input: {
              quantity: originalData.quantity,
              status: product.status,
            },
          })
        )
      );

      return products.slice(1).reduce<AggregatedProduct>(
        (res, product) => {
          res.originalData.push({
            id: product.id,
            quantity: product.quantity,
          });

          return res;
        },
        {
          ...products[0],
          originalData: [
            {
              // We are updating an aggregated product, so the products it comes from definitely exist
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              id: products[0]!.id,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              quantity: products[0]!.quantity,
            },
          ],
        } as AggregatedProduct
      );
    };

    return state.currentValue.products.map((product) => ({
      subject: product,
      getLabel: (product: AggregatedProduct) =>
        `${product.quantity}x ${product.name}`,
      renderCommands: (networkState: NetworkListItemState) => {
        const onStatusChange: FormEventHandler<HTMLSelectElement> = (event) => {
          const status = event.currentTarget.value as ProductStatus;

          setState((state) => ({
            ...state,
            currentValue: {
              ...state.currentValue,
              products: state.currentValue.products.map((p) => {
                if (p.sku === product.sku) {
                  return { ...p, status };
                } else {
                  return p;
                }
              }),
            },
          }));
        };

        const isUIDisabled = networkState.status === "loading";

        return (
          <>
            <select
              value={product.status}
              onChange={onStatusChange}
              disabled={isUIDisabled}
            >
              {Object.entries(ProductStatus).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <input type="submit" value="Save" disabled={isUIDisabled} />
          </>
        );
      },
      sendUpdateItemRequest: sendUpdateProductsRequest,
      onSuccessfulUpdate: (updatedProduct: AggregatedProduct) => {
        updatedProduct.originalData.forEach((originalData) => {
          dispatch(
            updateProduct({
              ...product,
              ...originalData,
            })
          );
        });
      },
    }));
  };

  return (
    <NetworkList
      title="Your Products"
      state={productsByOrder}
      getLabel={getOrderLabel}
      fetchItems={fetchProducts}
      sendUpdateItemRequest={sendUpdateProductRequest}
      onSuccessfulUpdate={onProductUpdate}
      renderCommands={() => null}
      renderSublist={renderProductsList}
    />
  );
}
