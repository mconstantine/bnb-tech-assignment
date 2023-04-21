import "./NetworkList.css";
import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { NetworkState as INetworkState } from "../features/network";
import { NetworkState } from "./NetworkState";
import { ServerError } from "../ServerError";

interface LoadingListItemState {
  status: "loading";
}

interface ReadyListItemState {
  status: "ready";
}

interface FailedListItemState {
  status: "failure";
  code: number;
}

export type NetworkListItemState =
  | LoadingListItemState
  | ReadyListItemState
  | FailedListItemState;

export interface ListItemState<T> {
  currentValue: T;
  didChange: boolean;
  networkState: NetworkListItemState;
}

interface ListProps<T> {
  title: string;
  state: INetworkState<T[]>;
  getLabel: (state: ListItemState<T>) => string;
  fetchItems: () => void;
  sendUpdateItemRequest: (item: T) => Promise<T>;
  onSuccessfulUpdate: (updatedItem: T) => void;
  renderCommands: (
    state: ListItemState<T>,
    setState: Dispatch<SetStateAction<ListItemState<T>>>
  ) => JSX.Element | JSX.Element[] | null;
}

export function NetworkList<T extends { id: number }>(props: ListProps<T>) {
  const { fetchItems } = props;

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="NetworkList">
      <h1>{props.title}</h1>
      <div role="list">
        <NetworkState
          state={props.state}
          dataHandler={(items) => (
            <>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  getLabel={(state) => props.getLabel(state)}
                  sendUpdateItemRequest={(item: T) =>
                    props.sendUpdateItemRequest(item)
                  }
                  onSuccessfulUpdate={props.onSuccessfulUpdate}
                  renderCommands={(state, setState) =>
                    props.renderCommands(state, setState)
                  }
                />
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
}

interface ListItemProps<T> {
  item: T;
  getLabel: (state: ListItemState<T>) => string;
  sendUpdateItemRequest: (item: T) => Promise<T>;
  onSuccessfulUpdate: (updatedItem: T) => void;
  renderCommands: (
    state: ListItemState<T>,
    setState: Dispatch<SetStateAction<ListItemState<T>>>
  ) => JSX.Element | JSX.Element[] | null;
}

function ListItem<T>(props: ListItemProps<T>) {
  const [state, setState] = useState<ListItemState<T>>({
    currentValue: props.item,
    didChange: false,
    networkState: { status: "ready" },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setState((state) => ({
      ...state,
      networkState: { status: "loading" },
    }));

    try {
      const data = await props.sendUpdateItemRequest(state.currentValue);

      setState({
        currentValue: data,
        networkState: { status: "ready" },
        didChange: false,
      });

      props.onSuccessfulUpdate(data);
    } catch (e) {
      if (e instanceof ServerError) {
        const serverError = e as ServerError;

        setState((state) => ({
          ...state,
          networkState: { status: "failure", code: serverError.code },
        }));
      } else {
        setState((state) => ({
          ...state,
          networkState: { status: "failure", code: 500 },
        }));
      }
    }
  };

  const setStateTrackChanges: Dispatch<SetStateAction<ListItemState<T>>> = (
    setStateAction
  ) => {
    if (typeof setStateAction === "function") {
      setState((state) => {
        return {
          ...setStateAction(state),
          didChange: true,
        };
      });
    } else {
      setState({
        ...setStateAction,
        didChange: true,
      });
    }
  };

  return (
    <div className="NetworkListItem" role="listitem">
      <p>{props.getLabel(state)}</p>
      <form onSubmit={onSubmit}>
        {props.renderCommands(state, setStateTrackChanges)}
      </form>
    </div>
  );
}
