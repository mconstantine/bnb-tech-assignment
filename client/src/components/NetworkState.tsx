import { NetworkState as INetworkState } from "../features/utils";
import { Loader } from "./Loader";

interface Props<T> {
  state: INetworkState<T>;
  dataHandler: (data: T) => JSX.Element;
}

export function NetworkState<T>(props: Props<T>) {
  switch (props.state.status) {
    case "loading":
      return <Loader />;
    case "failure":
      return <p>Error (code {props.state.code})</p>;
    case "success":
      return props.dataHandler(props.state.data);
  }
}
