import { useEffect, useRef, useState } from 'react';

interface AutoCompleteInputProps {
  onChange: (value: any) => void;
  data: any[];
  valueKey: string;
  valueId: string;
  placeholder: string;
  type: string;
  name: string;
  className: string;
  disabled: boolean;
  defaultValue?: any;
  // TODO: make the entire component rely on generic Types "T" instead of any
  // TODO: make this mendatory and remove valueKey
  getDisplayValue?: (item: any) => string;
}

const AutoCompleteInput = ({
  onChange,
  data,
  valueKey,
  valueId,
  placeholder,
  type,
  name,
  className,
  disabled = false,
  defaultValue,
  getDisplayValue,
}: AutoCompleteInputProps) => {
  const [inputValue, setInputValue] = useState<any>(defaultValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropDownWidth, setDropDownWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (item: any) => {
    const selectedOption = item;
    if (!selectedOption) {
      return;
    }
    setInputValue(item);
    onChange(selectedOption);
  };

  const handleDropdown = (show: boolean) => {
    setShowDropdown(show);
    if (!inputRef.current) {
      return;
    }
    const inputWidth = inputRef.current.getBoundingClientRect().width;
    setDropDownWidth(inputWidth);
  };

  const handleValue = (inputValue: any): string => {
    if (getDisplayValue) {
      return getDisplayValue(inputValue);
    }
    return inputValue ? inputValue[valueKey] : '';
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        value={handleValue(inputValue)}
        placeholder={placeholder}
        type={type}
        name={name}
        autoComplete="off"
        className={className}
        disabled={disabled}
        onBlur={() => setTimeout(() => handleDropdown(false), 100)}
        onFocus={() => handleDropdown(true)}
        onChange={() => console.log('changed')}
      />
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            cursor: 'pointer',
            width: dropDownWidth,
            height: '200px',
            overflow: 'auto',
            zIndex: '10',
          }}
        >
          {data.map((item) => (
            <div
              key={item[valueId]}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              style={{ padding: '10px' }}
              onMouseDown={() => handleInputChange(item)}
            >
              {getDisplayValue ? getDisplayValue(item) : item[valueKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteInput;
