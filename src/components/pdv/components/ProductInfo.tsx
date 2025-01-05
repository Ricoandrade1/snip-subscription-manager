interface ProductInfoProps {
  name: string;
  description?: string | null;
  brandName?: string;
  categoryName?: string;
}

export function ProductInfo({ name, description, brandName, categoryName }: ProductInfoProps) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-lg leading-none">{name}</h3>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-1">
          {description}
        </p>
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {brandName && (
          <span className="bg-muted px-2 py-0.5 rounded-full">
            {brandName}
          </span>
        )}
        {categoryName && (
          <span className="bg-muted px-2 py-0.5 rounded-full">
            {categoryName}
          </span>
        )}
      </div>
    </div>
  );
}