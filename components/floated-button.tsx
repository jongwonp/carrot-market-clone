import Link from 'next/link';

interface FloatedButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function FloatedButton({ href, children }: FloatedButtonProps) {
  return (
    <Link href={href}>
      <button className="fixed hover:bg-orange-500 transition-colors bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white">
        {children}
      </button>
    </Link>
  );
}
