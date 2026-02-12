import { ReactNode } from "react";
import clsx from "clsx";
import { FaArrowRight } from "react-icons/fa";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ButtonStarted({
  children,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-62.5 py-1 px-1 border-2 border-[#F76734] cursor-pointer group relative inline-flex items-center justify-between rounded-full text-lg font-medium transition-all duration-300 overflow-hidden",
        " bg-[#F76734] text-[#fbf5df]",
        "hover:bg-none hover:border-2 hover:border-[#40B045] hover:text-[#40B045] hover:bg-[#fbf5df]",
        className
      )}
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fbf5df] text-[#F76734] transition-all duration-300 group-hover:translate-x-48 group-hover:text-[#40B045]">
        <FaArrowRight />
      </span>
      <span className="absolute left-1/2 -translate-x-1/2">{children}</span>
    </button>
  );
}
