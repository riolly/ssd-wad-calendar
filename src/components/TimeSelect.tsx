import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";


export function TimeSelect({
  name,
  label,
  placeholder,
  className,
  opts,
  scrollableClassName,
}: {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  scrollableClassName?: string;
  opts: string[];
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="sr-only">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
              <SelectContent className="min-w-fit">
                <ScrollArea className={cn('border rounded', scrollableClassName)}>
                  {opts.map((opt, i) => (
                    <SelectItem key={`${i}-${opt}`} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
