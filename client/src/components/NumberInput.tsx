import "./NumberInput.css";

interface Props {
  count: number;
  min?: number | undefined;
  max?: number | undefined;
  onChange: (count: number) => void;
  disabled?: boolean | undefined;
}

export function NumberInput(props: Props) {
  const onChange = (count: number) => {
    if (
      (props.min !== undefined && count < props.min) ||
      (props.max !== undefined && count > props.max)
    ) {
      return;
    }

    props.onChange(count);
  };

  return (
    <div className="NumberInput">
      <button
        type="button"
        onClick={() => onChange(props.count - 1)}
        disabled={props.disabled}
      >
        -
      </button>
      <input
        type="number"
        min={props.min}
        max={props.max}
        value={props.count}
        onChange={(e) => props.onChange(Number(e.currentTarget.value) || 0)}
        disabled={props.disabled}
      />
      <button
        type="button"
        onClick={() => onChange(props.count + 1)}
        disabled={props.disabled}
      >
        +
      </button>
    </div>
  );
}
