import type { ReactNode } from "react";
import { MobileTopBlob, MobileBottomBlob } from "./MobileBlobs";
import BottomNav from "./BottomNav";

type Props = {
  title: string;
  showBottomBlob?: boolean;
  showBottomNav?: boolean;
  children: ReactNode;
};

export default function MobileShell({ title, showBottomBlob = false, showBottomNav = true, children }: Props) {
  return (
    <div className="m-shell">
      <MobileTopBlob title={title} />
      <main className="m-shell-content">{children}</main>
      {showBottomBlob && <MobileBottomBlob />}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
