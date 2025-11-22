import { ChevronDown } from "lucide-react";

function Select({ icon: SelectIcon, label, name, options, ...props }) {
  const isRequired = Object.keys(props).includes("required");

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <label htmlFor={name} className="text-gray-700 text-sm font-medium">
        {isRequired ? (
          <>
            <span>{label}</span>
            <span className="text-red-500">*</span>
          </>
        ) : (
          label
        )}
      </label>

      <div className="relative">
        {SelectIcon && (
          <div className="pl-3 pointer-events-none flex justify-center items-center absolute left-0 inset-y-0 z-10">
            <SelectIcon className="size-4 text-gray-400" />
          </div>
        )}

        <select
          id={name}
          name={name}
          className={`appearance-none w-full h-11 bg-white text-gray-900 px-3 py-2 border border-gray-200 rounded-xl transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            SelectIcon ? "pl-10" : ""
          }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>

        <div className="pr-3 pointer-events-none flex items-center absolute inset-y-0 right-0">
          <ChevronDown className="size-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default Select;
