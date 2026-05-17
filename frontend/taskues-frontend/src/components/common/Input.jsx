export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  required,
  notNull,
  icon,
  className = '',
  name,
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2 text-center sm:text-left">
          {label}
          {notNull && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-2 text-black border rounded-lg
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};