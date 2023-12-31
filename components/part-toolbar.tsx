"use client";
import { useCallback, useState } from "react";
import { Toggle, Toolbar } from "./ui/toggle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "./ui/label";

export const PartToolbar = ({
  part = "1",
  disable2 = false,
}: {
  part: "1" | "2";
  disable2?: boolean;
}) => {
  const [oneSelected, setOneSelected] = useState(part === "1");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Toolbar className="flex flex-col gap-y-2">
      <Label className="font-bold">Part</Label>
      <div className="bg-background rounded-md">
        <Toggle
          onChange={(val) => {
            setOneSelected(val);
            router.push(pathname + "?" + createQueryString("part", "1"));
          }}
          isSelected={oneSelected}
          variant="outline"
          className="border-r-0 rounded-r-none"
        >
          1
        </Toggle>
        <Toggle
          isDisabled={disable2}
          onChange={(val) => {
            setOneSelected(!val);
            router.push(pathname + "?" + createQueryString("part", "2"));
          }}
          isSelected={!oneSelected}
          variant="outline"
          className="rounded-l-none"
        >
          2
        </Toggle>
      </div>
    </Toolbar>
  );
};
