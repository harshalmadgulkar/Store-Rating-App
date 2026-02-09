import { X } from "lucide-react";
import React, { useState, useId, type ChangeEvent, useEffect } from "react";

// --- FloatingInput Component ---
// This component provides a styled input field with a floating label.
interface FloatingInputProps {
  label?: string; // The label text that floats above the input.
  customId?: string;
  type?:
  | "text"
  | "email"
  | "password"
  | "tel" // Added 'tel' type for telephone numbers.
  | "number" // 'number' type for numeric input with decimal handling.
  | "url"
  | "textarea"
  | "name"
  | "date" // The HTML input type. Added 'date'.
  | "time"; // Added 'time' type for time input.
  value?: string | number; // The current value of the input.
  name?: string; // The name attribute for the input.
  onChange: (value: string) => void; // Callback function triggered when the input value changes.
  maxLength?: number; // Maximum number of characters allowed.
  disabled?: boolean; // Whether the input is disabled.
  error?: string | null; // Error message to display below the input.
  height?: string | number; // Optional height for textarea type.
  labelBg?: string;
  labelColor?: string;
  showClearIcon?: boolean; // NEW: Prop to show a clear icon
  minDate?: string; // format: 'YYYY-MM-DD'
  maxDate?: string;
  step?: number | string;
  required?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = "text",
  value = "",
  name = "",
  onChange,
  maxLength,
  disabled = false,
  error,
  height,
  labelBg = "bg-gray-50",
  labelColor = "text-black",
  showClearIcon = false, // Set default to false
  minDate,
  maxDate,
  step,
  required = false
}) => {
  // State to manage the internal input value.
  const [inputValue, setInputValue] = useState<string | number>(value);
  // State to toggle password visibility for password type.
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  // Unique ID for accessibility (linking label to input).
  const inputId = useId();

  // Effect to update internal state when the external value prop changes.
  // This is important if the parent component updates the value prop.
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Toggles the visibility of the password input.
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Handles changes to the input field.
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let inputVal = e.target.value;

    // Apply input restrictions based on type.
    switch (type) {
      case "name":
        // Allows only letters and spaces, trims leading spaces, and collapses multiple spaces.
        // This is useful for name fields where only alphabetic characters and single spaces are expected.
        inputVal = inputVal
          .replace(/[^a-zA-Z\s]/g, "")
          .replace(/^\s+/g, "")
          .replace(/\s{2,}/g, " ");
        break;
      case "email":
        // Allows basic email characters (lowercase letters, numbers, @, ., _, -).
        // Note: A more comprehensive email validation would be needed for strict format checking.
        inputVal = inputVal.replace(/[^a-z0-9@._-]/g, "");
        break;
      case "tel": {
        inputVal = inputVal.replace(/[^0-9]/g, "");

        const blockedNumbers: string[] = [
          "9876543210",
          "9999999999",
          "8888888888",
          "7777777777",
          "6666666666"
        ];

        // While typing: allow up to 10 digits starting with 6-9
        if (!/^[6-9]\d{0,9}$/.test(inputVal)) {
          inputVal = inputVal.slice(0, -1); // Remove last invalid char
        }

        // Once full length reached: apply strict check
        if (inputVal.length === 10) {
          const strictPattern = /^[6-9]\d{9}$/;
          if (!strictPattern.test(inputVal) || blockedNumbers.includes(inputVal)) {
            inputVal = ""; // Clear invalid
          }
        }
        break;
      }
      case "number": {
        // --- START: Added/Improved logic for 'number' type ---
        // Remove all characters except digits and a single dot.
        inputVal = inputVal.replace(/[^0-9.]/g, "");
        // Ensure only one decimal point is allowed.
        const parts = inputVal.split(".");
        if (parts.length > 2) {
          inputVal = parts[0] + "." + parts.slice(1).join("");
        }
        // Remove leading zeros unless it's '0.' or a single '0'.
        if (
          /^0[0-9]/.test(inputVal) &&
          inputVal.length > 1 &&
          !inputVal.startsWith("0.")
        ) {
          inputVal = inputVal.replace(/^0+/, "");
        }
        // If the input is just a dot, prepend '0'.
        if (inputVal === ".") {
          inputVal = "0.";
        }
        // If it starts with just a dot (e.g., ".5"), convert to "0.5" if not already handled.
        if (
          inputVal.startsWith(".") &&
          inputVal.length > 1 &&
          !inputVal.startsWith("0.")
        ) {
          inputVal = "0" + inputVal;
        }
        // --- END: Added/Improved logic for 'number' type ---
        break;
      }
      case "url":
        // Basic URL character restrictions. This prevents spaces and limits characters to common URL components.
        // For strict URL validation, consider using a dedicated library or a more complex regex.
        inputVal = inputVal
          .replace(/\s+/g, "")
          .replace(/[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]/g, "");
        break;
      case "password":
        // No character restrictions are applied for password fields by default,
        // allowing users to enter any characters for their password.
        break;
      case "date":
        // No custom restrictions are applied for date input type.
        // The browser's native date picker handles the input format and validation.
        // The value will be in 'YYYY-MM-DD' format when selected via the picker.
        break;
      case "time":
        // Let browser handle time format, no sanitization needed here.
        break;
      default:
        // For 'text' and other types, no specific character restrictions are applied.
        break;
    }

    // Apply maxLength restriction if specified in the props.
    if (maxLength) {
      inputVal = inputVal.slice(0, maxLength);
    }

    // Update the component's internal state with the potentially modified input value.
    setInputValue(inputVal);
    // Call the external onChange handler provided by the parent component,
    // passing the processed input value.
    onChange(inputVal);
  };

  // Determines the actual HTML input 'type' attribute value based on the component's 'type' prop
  // and the 'passwordVisible' state for password fields.
  // For 'number' type, 'tel' is used as it often provides a numeric keyboard on mobile devices
  // without enforcing strict number formatting during input (which is handled in handleInputChange).
  // Note: If you need native browser validation/spinners for 'number', you might change this to 'number'.
  const inputType =
    type === "password"
      ? passwordVisible
        ? "text"
        : "password"
      : type === "number" // Still mapping 'number' to 'tel' for mobile keyboard benefit
        ? "tel"
        : type;

  return (
    <div>
      <div className="relative w-full">
        {/* Conditionally render a textarea or an input element based on the 'type' prop. */}
        {type === "textarea" ? (
          <textarea
            id={inputId} // Link label to textarea for accessibility.
            name={name} // Assign the name attribute.
            value={inputValue} // Bind the input value to the component's state.
            disabled={disabled} // Apply disabled state if true.
            onChange={handleInputChange} // Attach the input change handler.
            style={{ height }} // Apply custom height for textarea.
            className={`block px-3 pb-2 pt-3 w-full text-base text-black  rounded-md border border-gray-500 focus:outline-0 focus:ring-0 focus:border-blue-600 peer transition-all 
							${error ? "border-red-600" : ""}
							${disabled ? 'bg-gray-100' : 'bg-transparent'} `}
            placeholder=" "
          />
        ) : (
          <input
            id={inputId} // Link label to input for accessibility.
            name={name} // Assign the name attribute.
            type={inputType} // Set the determined HTML input type.
            value={inputValue} // Bind the input value to the component's state.
            disabled={disabled} // Apply disabled state if true.
            onChange={handleInputChange} // Attach the input change handler.
            {...(type === "date" && minDate ? { min: minDate } : {})}
            {...(type === "date" && maxDate ? { max: maxDate } : {})}
            className={`block pt-3 pb-2 px-3 w-full text-sm  ${labelColor}  rounded-md border border-gray-400 appearance-none focus:outline-0 focus:ring-0 focus:border-blue-600 peer transition-all 
							${error ? "border-red-600" : ""} ${type === "date" ? "calendar-icon-padding" : ""} 
							${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent cursor-auto'} 
						${type === "time" ? "calendar-icon-padding" : ""} scroll-mt-3`}
            placeholder=""
            step={step} // For Seconds in format HH:MM:SS
            autoComplete="off"
          />
        )}

        {/* Password visibility toggle icon, displayed only for password type inputs. */}
        {type === "password" && (
          <span
            onClick={togglePasswordVisibility} // Toggle password visibility on click.
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer select-none">
            {/* Display the appropriate emoji icon based on the passwordVisible state. */}
            {passwordVisible ? "🙈" : "👁"}
          </span>
        )}

        {/* NEW: Optional Clear Icon */}
        {showClearIcon && inputValue && !disabled && (
          <span
            onClick={() => {
              setInputValue("");
              onChange("");
            }}
            className={`absolute inset-y-0 pr-3 flex items-center text-gray-600 cursor-pointer select-none ${type === 'password' ? 'right-6' : 'right-0'}`}
          >
            {/* SVG for a clear/close icon */}
            <X />
          </span>
        )}

        {/* The floating label element. */}
        <label
          htmlFor={inputId} // Associate the label with the input/textarea using the unique ID.
          className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-95 top-1.5 left-2 origin-[1]  px-2 peer-focus:${labelBg} peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 ${type === "textarea"
            ? "peer-placeholder-shown:top-5"
            : "peer-placeholder-shown:top-1/2" // Adjust vertical position for textarea.
            } peer-focus:top-1.5 peer-focus:scale-100 peer-focus:-translate-y-4
						${disabled && inputValue ? 'bg-gray-100 cursor-not-allowed' : `${labelBg} cursor-auto`}`}>
          {required && <span className="text-red-500">*</span>} {label} {/* Display the label text. */}
        </label>
      </div>
      {/* Display the error message below the input if the 'error' prop is provided. */}
      {error && <p className="mt-1 ms-1 text-xs text-red-500 errorClass">{error}</p>}
    </div>
  );
};

export default FloatingInput;
