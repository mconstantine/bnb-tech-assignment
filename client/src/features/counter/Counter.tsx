import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { increment, selectCount } from "./counterSlice";

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(increment())}>count is {count}</button>
  );
}
