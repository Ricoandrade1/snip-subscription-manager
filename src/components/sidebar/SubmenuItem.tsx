import { useNavigate } from "react-router-dom";

interface SubmenuItemProps {
  title: string;
  url: string;
  isActive: boolean;
  subscriberCount?: number;
}

export function SubmenuItem({ title, url, isActive, subscriberCount }: SubmenuItemProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(url)}
      className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-muted ${
        isActive ? "bg-muted" : ""
      }`}
    >
      <span>{title}</span>
      {subscriberCount !== undefined && (
        <span className="ml-auto text-xs opacity-60">{subscriberCount}</span>
      )}
    </button>
  );
}