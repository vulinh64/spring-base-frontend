import clsx from "clsx";

interface HrProps {
  className?: string;
}

export function Hr({ className }: HrProps) {
  return <hr className={clsx("border-gray-800", className)} />;
}
