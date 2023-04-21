import { Dispatch, FormEventHandler, SetStateAction } from "react";
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
import { UpdateProductInput } from "./api";

// We group the product by SKU and orderId, summing up the quantitites and chain the IDs

interface AggregatedProductList {
  [orderId: number]: {
    [sku: string]: Product;
  };
}

export function ProductList() {
  const productListState = useAppSelector(selectProductList);
  const dispatch = useAppDispatch();

  const aggregatedProductListState = mapNetworkState(
    productListState,
    (products) =>
      products.reduce<AggregatedProductList>((res, product) => {
        if (product.OrderId in res) {
          if (product.sku in (res[product.OrderId] || {})) {
            // We just verified that the key exists and it can only be an object
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            res[product.OrderId]![product.sku] = {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...res[product.OrderId]![product.sku]!,
              quantity:
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                res[product.OrderId]![product.sku]!.quantity + product.quantity,
            };
          } else {
            // We just verified that the key exists and it can only be an object
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            res[product.OrderId]![product.sku] = product;
          }
        } else {
          res[product.OrderId] = {
            [product.sku]: product,
          };
        }

        return res;
      }, {})
  );

  // Turn the aggregation back into an array
  const aggregatedProducts = mapNetworkState<AggregatedProductList, Product[]>(
    aggregatedProductListState,
    (state) =>
      Object.values(state).reduce(
        (res, skuProductRecord) => [...res, ...Object.values(skuProductRecord)],
        []
      )
  );

  const fetchProducts = () => {
    dispatch(fetchProductList());
  };

  const getProductLabel = (state: ListItemState<Product>) => {
    switch (state.networkState.status) {
      case "loading":
        return "Saving…";
      case "failure":
        return `Error (code ${state.networkState.code})`;
      case "ready": {
        return `${state.currentValue.quantity}x ${state.currentValue.name}`;
      }
    }
  };

  const sendUpdateProductRequest = (product: Product) => {
    // Quantities here are aggregated, so we allow to only update the status
    switch (productListState.status) {
      case "loading":
      case "failure":
        return Promise.resolve(product);
      case "success": {
        const originalProduct = productListState.data.find(
          ({ id }) => id === product.id
        );

        if (!originalProduct) {
          return Promise.resolve(product);
        } else {
          return sendNetworkRequest<UpdateProductInput, Product>({
            path: `/products/${product.id}/`,
            method: "PATCH",
            input: {
              quantity: originalProduct.quantity,
              status: product.status,
            },
          });
        }
      }
    }
  };

  const onProductUpdate = (product: Product) => {
    dispatch(updateProduct(product));
  };

  const renderCommands = (
    state: ListItemState<Product>,
    setState: Dispatch<SetStateAction<ListItemState<Product>>>
  ) => {
    const onStatusChange: FormEventHandler<HTMLSelectElement> = (event) => {
      const value = event.currentTarget.value as ProductStatus;

      setState((state) => ({
        ...state,
        currentValue: {
          ...state.currentValue,
          status: value,
        },
      }));
    };

    const isSubmitButtonDisabled =
      !state.didChange || state.networkState.status === "loading";

    return (
      <>
        <select value={state.currentValue.status} onChange={onStatusChange}>
          {Object.entries(ProductStatus).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input type="submit" value="Save" disabled={isSubmitButtonDisabled} />
      </>
    );
  };

  return (
    <NetworkList
      title="Your Products"
      state={aggregatedProducts}
      getLabel={getProductLabel}
      fetchItems={fetchProducts}
      sendUpdateItemRequest={sendUpdateProductRequest}
      onSuccessfulUpdate={onProductUpdate}
      renderCommands={renderCommands}
    />
  );
}
