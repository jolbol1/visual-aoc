import { AdventCalendar } from "@/components/advent-cal";
import { Icons } from "@/components/icons";
import { Snow } from "@/components/snow";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: { snowOff: boolean };
}) {
  return (
    <main className="flex-1 flex min-h-screen flex-col items-center container justify-center gap-6 py-6 pb-12 relative">
      <div className="overflow-hidden z-[-1] absolute">
        {!searchParams.snowOff ? <Snow /> : null}
      </div>
      <div className="flex flex-col justify-center items-center  gap-2">
        <h1 className="text-center font-display text-3xl sm:text-5xl md:text-6xl">
          🎄Advent Of Code 🎅🏼
        </h1>
        <h2 className="font-medium text-gray-300 text-xl text-center">
          My solutions to 2023&apos;s Advent of Code visualized.
        </h2>
      </div>
      <AdventCalendar />
      <footer className="absolute bottom-0 flex items-center gap-1">
        Built by{" "}
        <Link href="https://jamesshopland.com" className="underline">
          James Shopland
        </Link>
        <Link
          href={"https://github.com/jolbol1"}
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-9 px-0"
            )}
          >
            <Icons.gitHub className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
        <Link
          href="https://twitter.com/JollyShopland"
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-9 px-0"
            )}
          >
            <Icons.twitter className="h-3 w-3 fill-current" />
            <span className="sr-only">Twitter</span>
          </div>
        </Link>
      </footer>
    </main>
  );
}
