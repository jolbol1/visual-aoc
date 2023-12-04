import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button-variants";
import { Icons } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="h-6 w-6">🎅🏼</span>
            <span className="hidden font-bold sm:inline-block">
              Advent of Code
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn("transition-colors hover:text-foreground/80")}
            >
              Home
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center gap-2">
            <Link
              href="https://jamesshopland.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground/80 text-sm font-medium"
            >
              About Me
            </Link>
            <Link
              href={"https://github.com/jolbol1/visual-aoc"}
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
          </nav>
        </div>
      </div>
    </header>
  );
}
