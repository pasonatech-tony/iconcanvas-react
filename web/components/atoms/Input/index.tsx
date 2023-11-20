import { Input } from "antd";
import { ChangeEvent } from "react";

type InputProps = {
  id: string;
  type: "text" | "number" | "email" | "password";
  value: string | number;
  name: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputComponent: React.FC<InputProps> = ({
  type,
  id,
  value,
  name,
  placeholder,
  disabled,
  onChange,
}) => {
  return (
    <Input
      type={type}
      id={id}
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default InputComponent;
