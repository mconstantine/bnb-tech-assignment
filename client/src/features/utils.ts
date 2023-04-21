import { PayloadAction } from "@reduxjs/toolkit";
import { env } from "../env";
import { ServerError } from "../ServerError";

interface IdleNetworkState {
  status: "idle";
}

interface LoadingNetworkState {
  status: "loading";
}

interface SuccessfulNetworkState<T> {
  status: "success";
  data: T;
}

interface FailedNetworkState {
  status: "failure";
  code: number;
}

export type NetworkState<T> =
  | IdleNetworkState
  | LoadingNetworkState
  | SuccessfulNetworkState<T>
  | FailedNetworkState;

export function makeNetworkReducers<T>() {
  return {
    isLoading: (state: NetworkState<T>): NetworkState<T> => {
      switch (state.status) {
        case "idle":
        case "failure":
        case "success":
          return { status: "loading" };
        case "loading":
          return state;
      }
    },
    didSucceed: (
      state: NetworkState<T>,
      action: PayloadAction<T>
    ): NetworkState<T> => {
      switch (state.status) {
        case "idle":
        case "success":
        case "failure":
          return state;
        case "loading":
          return { status: "success", data: action.payload };
      }
    },
    didFail: (
      state: NetworkState<T>,
      action: PayloadAction<number>
    ): NetworkState<T> => {
      switch (state.status) {
        case "idle":
        case "success":
        case "failure":
          return state;
        case "loading":
          return { status: "failure", code: action.payload };
      }
    },
  };
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface NetworkRequest<I> {
  method: HttpMethod;
  path: string;
  input: I;
}

export async function makeNetworkRequest<I, O>(
  request: NetworkRequest<I>
): Promise<O>;
export async function makeNetworkRequest<O>(
  request: Omit<NetworkRequest<void>, "input">
): Promise<O>;
export async function makeNetworkRequest<I, O>(
  request: NetworkRequest<I> | Omit<NetworkRequest<void>, "input">
): Promise<O> {
  const response = await window.fetch(`${env.VITE_API_URL}${request.path}`, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: "input" in request ? JSON.stringify(request.input) : null,
  });

  if (Math.floor(response.status / 100) !== 2) {
    throw new ServerError(response.status, response.statusText);
  } else {
    const data = await response.json();
    return data as O;
  }
}
