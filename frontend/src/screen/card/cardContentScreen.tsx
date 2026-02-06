import { cn } from "../../ui/utils";

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 last:pb-6", className)}
      {...props}
    />
  );
}

export { CardContent };