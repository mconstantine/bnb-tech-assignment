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

interface SublistItemNoCommands<T> {
  subject: T;
  getLabel: (subject: T) => string;
}

interface SublistItemWithCommands<T> {
  subject: T;
  getLabel: (subject: T) => string;
  renderCommands: (
    networkState: NetworkListItemState
  ) => JSX.Element | JSX.Element[] | null;
  sendUpdateItemRequest: (item: T) => Promise<T>;
  onSuccessfulUpdate: (updatedItem: T) => void;
}

export type SublistItem<T> =
  | SublistItemNoCommands<T>
  | SublistItemWithCommands<T>;

interface ListPropsNoCommands<T, S> {
  title: string;
  state: INetworkState<T[]>;
  getLabel: (state: ListItemState<T>) => string;
  fetchItems: () => void;
  renderSublist?:
    | ((
        state: ListItemState<T>,
        setState: Dispatch<SetStateAction<ListItemState<T>>>
      ) => SublistItem<S>[])
    | undefined;
}

interface ListPropsWithCommands<T, S> {
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
  renderSublist?:
    | ((
        state: ListItemState<T>,
        setState: Dispatch<SetStateAction<ListItemState<T>>>
      ) => SublistItem<S>[])
    | undefined;
}

type ListProps<T, S> = ListPropsNoCommands<T, S> | ListPropsWithCommands<T, S>;

export function NetworkList<T extends { id: number }, S>(
  props: ListProps<T, S>
) {
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
              {items.map((item) => {
                if ("renderCommands" in props) {
                  return (
                    <ListItem
                      key={item.id}
                      item={item}
                      getLabel={(state) => props.getLabel(state)}
                      sendUpdateItemRequest={(item) =>
                        props.sendUpdateItemRequest(item)
                      }
                      onSuccessfulUpdate={props.onSuccessfulUpdate}
                      renderCommands={(state, setState) =>
                        props.renderCommands(state, setState)
                      }
                      renderSublist={props.renderSublist}
                    />
                  );
                } else {
                  return (
                    <ListItem
                      key={item.id}
                      item={item}
                      getLabel={(state) => props.getLabel(state)}
                      renderSublist={props.renderSublist}
                    />
                  );
                }
              })}
            </>
          )}
        />
      </div>
    </div>
  );
}

interface ListItemPropsNoCommands<T, S> {
  item: T;
  getLabel: (state: ListItemState<T>) => string;
  renderSublist?:
    | ((
        state: ListItemState<T>,
        setState: Dispatch<SetStateAction<ListItemState<T>>>
      ) => SublistItem<S>[])
    | undefined;
}

interface ListItemPropsWithCommands<T, S> {
  item: T;
  getLabel: (state: ListItemState<T>) => string;
  sendUpdateItemRequest: (item: T) => Promise<T>;
  onSuccessfulUpdate: (updatedItem: T) => void;
  renderCommands: (
    state: ListItemState<T>,
    setState: Dispatch<SetStateAction<ListItemState<T>>>
  ) => JSX.Element | JSX.Element[] | null;
  renderSublist?:
    | ((
        state: ListItemState<T>,
        setState: Dispatch<SetStateAction<ListItemState<T>>>
      ) => SublistItem<S>[])
    | undefined;
}

type ListItemProps<T, S> =
  | ListItemPropsNoCommands<T, S>
  | ListItemPropsWithCommands<T, S>;

function ListItem<T, S>(props: ListItemProps<T, S>) {
  const [state, setState] = useState<ListItemState<T>>({
    currentValue: props.item,
    didChange: false,
    networkState: { status: "ready" },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if ("renderCommands" in props) {
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

  const sublist = props.renderSublist
    ? props.renderSublist(state, setStateTrackChanges)
    : null;

  return (
    <div className="NetworkListItem" role="listitem">
      <p>{props.getLabel(state)}</p>
      {"renderCommands" in props ? (
        <form onSubmit={onSubmit}>
          {props.renderCommands(state, setStateTrackChanges)}
        </form>
      ) : null}
      {sublist !== null ? (
        <div className="sublist" role="list">
          {sublist.map((sublistItem, index) => (
            <SublistItem key={index} item={sublistItem} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface SublistItemProps<T> {
  item: SublistItem<T>;
}

export function SublistItem<T>(props: SublistItemProps<T>) {
  const [networkState, setNetworkState] = useState<NetworkListItemState>({
    status: "ready",
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if ("renderCommands" in props.item) {
      setNetworkState({ status: "loading" });

      try {
        const data = await props.item.sendUpdateItemRequest(props.item.subject);
        props.item.onSuccessfulUpdate(data);
        setNetworkState({ status: "ready" });
      } catch (e) {
        if (e instanceof ServerError) {
          setNetworkState({ status: "failure", code: e.code });
        } else {
          setNetworkState({ status: "failure", code: 500 });
        }
      }
    }
  };

  const label = (() => {
    switch (networkState.status) {
      case "loading":
        return "Loading…";
      case "failure":
        return `Error (code ${networkState.code})`;
      case "ready":
        return props.item.getLabel(props.item.subject);
    }
  })();

  return (
    <div className="sublist-item">
      <p>{label}</p>
      {"renderCommands" in props.item ? (
        <form onSubmit={onSubmit}>
          {props.item.renderCommands(networkState)}
        </form>
      ) : null}
    </div>
  );
}
