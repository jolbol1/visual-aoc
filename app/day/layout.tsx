import { SiteHeader } from "@/components/header";

export default function DayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 container ">{children}</main>
    </>
  );
}
