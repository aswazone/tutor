import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ICategoryOption } from "@/config/helper.config";

interface CategorySelectorProps {
  categories: ICategoryOption[];
  value?: string;
  onChange: (value: string) => void;
}

export function CategorySelector({
  categories,
  value,
  onChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);

  // Find the selected category and subcategory labels
  const getSelectedLabel = () => {
    for (const category of categories) {
      if (category.id === value) {
        return category.label;
      }
      if (category.subcategories) {
        const subcategory = category.subcategories.find(sub => sub.id === value);
        if (subcategory) {
          return `${category.label} > ${subcategory.label}`;
        }
      }
    }
    return "";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? getSelectedLabel() : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <ScrollArea className="h-[300px]">
            {categories.map((category) => (
              <CommandGroup key={category.id} heading={category.label}>
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.label}
                </CommandItem>
                {category.subcategories?.map((subcategory) => (
                  <CommandItem
                    key={subcategory.id}
                    value={subcategory.id}
                    onSelect={() => {
                      onChange(subcategory.id);
                      setOpen(false);
                    }}
                    className="ml-4"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === subcategory.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {subcategory.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
