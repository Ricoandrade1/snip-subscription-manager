interface SubmenuItemProps {
  title: string;
  url: string;
  isActive: boolean;
  subscriberCount?: number;
  onClick: () => void;
}

export function SubmenuItem({
  title,
  isActive,
  subscriberCount,
  onClick,
}: SubmenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-muted ${
        isActive ? "bg-muted" : ""
      }`}
    >
      <span>{title}</span>
      {typeof subscriberCount === "number" && (
        <span className="ml-auto text-xs opacity-60">{subscriberCount}</span>
      )}
    </button>
  );
}