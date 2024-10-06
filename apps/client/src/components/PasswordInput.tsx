import { Input, InputProps } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export const PasswordInput = (props: InputProps) => {
  const { label } = props;

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const endContent = (
    <button onClick={toggleVisibility} type="button">
      {isVisible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <Input
      endContent={endContent}
      isRequired
      label={label || "Şifre"}
      name="password"
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
};
