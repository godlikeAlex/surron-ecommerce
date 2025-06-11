export const DatePickerInput = ({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error: unknown;
  onChange: (text: string) => void;
}) => (
  <>
    <label htmlFor="mock-input-date">{label}</label>
    <input
      id="mock-input-date"
      value={value?.toString()}
      onChange={(event) => onChange && onChange(event.target.value)}
      type="text"
    />
    {error}
  </>
);
