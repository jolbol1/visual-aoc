"use client";
import { ListBox, ListBoxItem } from "react-aria-components";
import Image from "next/image";

import { cn } from "@/lib/utils";

const days = [
  { id: 1, completed: true },
  { id: 2, completed: true },
  { id: 3, completed: false },
  { id: 4, completed: false },
  { id: 5, completed: false },
  { id: 6, completed: false },
  { id: 7, completed: false },
  { id: 8, completed: false },
  { id: 9, completed: false },
  { id: 10, completed: false },
  { id: 11, completed: false },
  { id: 12, completed: false },
  { id: 13, completed: false },
  { id: 14, completed: false },
  { id: 15, completed: false },
  { id: 16, completed: false },
  { id: 17, completed: false },
  { id: 18, completed: false },
  { id: 19, completed: false },
  { id: 20, completed: false },
  { id: 21, completed: false },
  { id: 22, completed: false },
  { id: 23, completed: false },
  { id: 24, completed: false },
];

export function AdventCalendar() {
  return (
    <ListBox
      layout="grid"
      aria-label="advent calendar"
      items={days}
      className="outline-none grid justify-center grid-cols-[repeat(auto-fill,_minmax(150px,_150px))] gap-4  w-full  lg:max-w-[1014px]"
    >
      {(item) => (
        <ListBoxItem
          href={item.completed ? `/day/${item.id}` : undefined}
          className={cn(
            "bg-background flex justify-center items-center rounded-md border-border border h-[150px] w-[150px] relative overflow-hidden",
            { "data-[hovered]:bg-gray-400": item.completed }
          )}
          aria-label={`Day ${item.id}`}
        >
          {({ isHovered }) => (
            <>
              <Image
                className={cn(
                  "absolute z-10 inset-0 h-[150px] w-[150px]",
                  (!item.completed || isHovered) && "opacity-40"
                )}
                src={`/advent/${item.id}.webp`}
                alt={`Door ${item.id}`}
                width={150}
                height={150}
                priority
                style={{ objectFit: "fill" }}
              />
              {item.completed && (
                <p className=" absolute top-0 right-0 z-10 text-xl">✅</p>
              )}
              <p
                className={cn(
                  "font-advent text-8xl font-bold z-10   bg-transparent",
                  item.completed ? "text-white" : "text-gray-400"
                )}
              >
                {item.id}
              </p>
            </>
          )}
        </ListBoxItem>
      )}
    </ListBox>
  );
}
