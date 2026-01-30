import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  style?: React.CSSProperties;
}

export function Input({ label, id, className, style, ...props }: InputProps) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={className} style={style} {...props} />
    </div>
  );
}
