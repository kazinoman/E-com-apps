"use client";

import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { FilterSidebar } from "./FilterSidebar";
import { SlidersHorizontal, X } from "lucide-react";
import { CategoryOption } from "@/services/search.service";

export function FilterDrawer({ categories }: { categories: CategoryOption[] }) {
  return (
    <Drawer direction="left">
      <DrawerTrigger className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </DrawerTrigger>
      <DrawerContent className="h-full w-[80vw] sm:w-[350px] mt-0 rounded-none">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-zinc-800">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerClose className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto h-full pb-20">
          <FilterSidebar categories={categories} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
