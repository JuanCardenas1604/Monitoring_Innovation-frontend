import { motion } from "framer-motion";

type Props = {
  title: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function MobileTopBlob({ title }: Props) {
  return (
    <div className="m-topblob" aria-hidden="true">
      <motion.svg
        className="m-topblob-svg"
        viewBox="0 0 390 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ y: -90, opacity: 0, scale: 1.06 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: easeOut }}
      >
        <defs>
          <linearGradient id="m-blob-grad" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#C6007E" />
            <stop offset="55%" stopColor="#7B5BFF" />
            <stop offset="100%" stopColor="#40CEE4" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L140,0 Q150,90 110,110 Q70,135 50,150 Q30,165 0,160 Z"
          fill="url(#m-blob-grad)"
        />
        <path
          d="M170,0 L390,0 L390,150 Q360,140 320,135 Q260,128 240,90 Q220,40 170,30 Z"
          fill="url(#m-blob-grad)"
        />
      </motion.svg>
      <motion.span
        className="m-topblob-title"
        aria-hidden="true"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.35, ease: easeOut }}
      >
        {title}
      </motion.span>
    </div>
  );
}

export function MobileBottomBlob() {
  return (
    <motion.div
      className="m-bottomblob"
      aria-hidden="true"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: easeOut }}
    >
      <svg viewBox="0 0 390 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="m-bottomblob-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E6F8FB" />
            <stop offset="100%" stopColor="#FBEDF4" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 Q60,10 120,40 Q180,70 240,40 Q300,10 390,40 L390,110 L0,110 Z"
          fill="url(#m-bottomblob-grad)"
        />
      </svg>
    </motion.div>
  );
}
