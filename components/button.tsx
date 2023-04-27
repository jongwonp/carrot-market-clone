import { cls } from '@/libs/utils';

interface ButtonProps {
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  large = false,
  text,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cls(
        'w-full py-2 px-4 bg-orange-500 text-white rounded-md shadow-sm font-medium border border-transparent hover:bg-orange-600 focus:ring-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
        large ? 'py-3 text-base' : 'py-2 text-sm'
      )}
    >
      {text}
    </button>
  );
}
