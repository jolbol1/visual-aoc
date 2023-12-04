"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  let router = useRouter();

  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
