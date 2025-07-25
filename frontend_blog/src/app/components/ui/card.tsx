// components/ui/card.tsx
import { cn } from "@/app/lib/utils"; // hoặc "@/lib/utils" tùy cấu trúc của bạn

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props} />
  );

}