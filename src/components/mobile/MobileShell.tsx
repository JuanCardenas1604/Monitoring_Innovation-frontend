import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MobileTopBlob, MobileBottomBlob } from "./MobileBlobs";
import BottomNav from "./BottomNav";

type Props = {
  title: string;
  showBottomBlob?: boolean;
  showBottomNav?: boolean;
  children: ReactNode;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function MobileShell({ title, showBottomBlob = false, showBottomNav = true, children }: Props) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      className="m-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      <MobileTopBlob title={title} />

      <motion.main
        className="m-shell-content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: easeOut }}
      >
        {children}
      </motion.main>

      {showBottomBlob && <MobileBottomBlob />}
      {showBottomNav && <BottomNav />}
    </motion.div>
  );
}
