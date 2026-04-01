import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { cn } from "../utils/cn";

const LAUNCH_THANKS = [
  { flagCode: "us", label: "Thank you" },
  { flagCode: "fr", label: "Merci" },
  { flagCode: "es", label: "Gracias" },
  { flagCode: "de", label: "Danke" },
  { flagCode: "it", label: "Grazie" },
  { flagCode: "pt", label: "Obrigado" },
  { flagCode: "jp", label: "Arigato" },
  { flagCode: "cn", label: "Xiexie" },
  { flagCode: "kr", label: "Gamsahamnida" },
  { flagCode: "sa", label: "Shukran" },
  { flagCode: "ru", label: "Spasibo" },
  { flagCode: "in", label: "Dhanyavad" },
  { flagCode: "tr", label: "Tesekkurler" },
  { flagCode: "nl", label: "Dank je" },
  { flagCode: "se", label: "Tack" },
  { flagCode: "dk", label: "Tak" },
  { flagCode: "fi", label: "Kiitos" },
  { flagCode: "no", label: "Takk" },
  { flagCode: "pl", label: "Dziekuje" },
  { flagCode: "cz", label: "Dekuji" },
  { flagCode: "sk", label: "Dakujem" },
  { flagCode: "hr", label: "Hvala" },
  { flagCode: "ro", label: "Multumesc" },
  { flagCode: "hu", label: "Koszonom" },
  { flagCode: "gr", label: "Efharisto" },
  { flagCode: "ee", label: "Aitah" },
  { flagCode: "lv", label: "Paldies" },
  { flagCode: "lt", label: "Aciu" },
  { flagCode: "th", label: "Khop khun" },
  { flagCode: "vn", label: "Cam on" },
  { flagCode: "ph", label: "Salamat" },
  { flagCode: "id", label: "Terima kasih" },
  { flagCode: "ke", label: "Asante" },
  { flagCode: "za", label: "Ngiyabonga" },
  { flagCode: "il", label: "Toda" },
  { flagCode: "us", label: "Mahalo" },
  { flagCode: "al", label: "Faleminderit" },
  { flagCode: "ie", label: "Go raibh maith agat" },
  { flagCode: "gb", label: "Diolch" },
  { flagCode: "fr", label: "Trugarez" },
  { flagCode: "bd", label: "Dhonnobad" },
  { flagCode: "pk", label: "Shukriya" },
  { flagCode: "in", label: "Nandri" },
  { flagCode: "np", label: "Dhanyabaad" },
  { flagCode: "id", label: "Matur nuwun" },
  { flagCode: "ng", label: "Nagode" },
  { flagCode: "ws", label: "O se" },
  { flagCode: "kz", label: "Rakhmet" },
  { flagCode: "ht", label: "Mesi" },
  { flagCode: "mn", label: "Bayarlalaa" },
] as const;

const LEFT_LAUNCH_THANKS = LAUNCH_THANKS.filter((_, index) => index % 2 === 0);
const RIGHT_LAUNCH_THANKS = LAUNCH_THANKS.filter(
  (_, index) => index % 2 !== 0
);

const LAUNCH_WALKER_SRC =
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aGxlbTF6ZWxvOTlodGZ5N2J4OHBncmEzdW43bm91aHdrM2xsaWF3aCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/B5dF2f7snrGZaVXELO/giphy.gif";

const LAUNCH_SIDE_STICKERS = [
  {
    src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN4enpsd3NodjZtMDE2OTBtNHc3OGFrdHdtenJ3NWh2MThlMGg0cCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/bnYSkdkryeRDLvW3az/giphy.gif",
    className:
      "absolute left-[3%] top-[14%] w-[118px] sm:left-[5%] sm:w-[132px] lg:left-[6%] lg:w-[148px]",
    delay: 6.15,
    scale: [0.68, 0.88, 1, 0.92, 0.58],
    x: [0, -8, 6, -4],
    y: [18, 0, -6, -18],
    rotate: [-4, 0, 3, -2],
  },
  {
    src: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2szZmFrZTYycHo4ejFxemphaXo1NDVreW9xYzdpaW40cTlhNXIzeiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/5HsASczHW6A3nTQjdh/giphy.gif",
    className:
      "absolute right-[3%] top-[7%] w-[102px] sm:right-[5%] sm:w-[118px] lg:right-[6%] lg:w-[132px]",
    delay: 6.45,
    scale: [0.82, 0.98, 1.08, 1, 0.62],
    x: [10, 0, -8, 4],
    y: [12, 0, -12, -20],
    rotate: [8, 0, -6, 4],
  },
  {
    src: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NjJranJ5ZnkxYnljc2RqanB4amFraDIzdTExa3lhMWc0ZTRmMTJ1NCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/6EXCUbLxgqlEDysMc5/giphy.gif",
    className:
      "absolute right-[6%] bottom-[16%] w-[82px] sm:right-[8%] sm:w-[96px] lg:right-[10%] lg:w-[112px]",
    delay: 6.85,
    scale: [0.68, 0.88, 1, 0.92, 0.58],
    x: [14, 0, -10, 3],
    y: [20, 0, -8, -24],
    rotate: [10, 0, -5, 2],
  },
] as const;

function getLaunchFlagSrc(flagCode: string) {
  return `https://flagcdn.com/24x18/${flagCode}.png`;
}

type LaunchFxOverlayProps = {
  burstIds: number[];
};

function LaunchFxOverlay({ burstIds }: LaunchFxOverlayProps) {
  return (
    <AnimatePresence>
      {burstIds.map((burstId) => (
        <motion.div
          key={burstId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: [0, 0.6, 0], x: [-120, 0, 40] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-y-[8%] left-0 w-20 bg-gradient-to-r from-red-500/0 via-red-500/24 to-transparent blur-2xl md:w-28"
          />
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: [0, 0.6, 0], x: [120, 0, -40] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-y-[8%] right-0 w-20 bg-gradient-to-l from-red-500/0 via-red-500/24 to-transparent blur-2xl md:w-28"
          />

          {LEFT_LAUNCH_THANKS.map((entry, index) => (
            <motion.div
              key={`left-thanks-${burstId}-${entry.label}`}
              initial={{ opacity: 0, x: -46, scale: 0.92 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [-46, 0, 18],
                scale: [0.92, 1, 0.98],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.34,
                delay: index * 0.22,
                ease: "easeInOut",
              }}
              style={{ top: `${4 + index * 3.7}%` }}
              className="absolute left-4 whitespace-nowrap text-right font-black uppercase tracking-[0.16em] text-red-50/95 drop-shadow-[0_0_14px_rgba(255,45,45,0.48)] md:left-7"
            >
              <span className="inline-flex items-center justify-end gap-2 text-[0.78rem] md:text-[0.94rem]">
                <span>{entry.label}</span>
                <img
                  src={getLaunchFlagSrc(entry.flagCode)}
                  alt=""
                  className="h-[0.95rem] w-[1.28rem] rounded-[2px] object-cover shadow-[0_0_8px_rgba(255,255,255,0.12)] md:h-[1.05rem] md:w-[1.42rem]"
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </motion.div>
          ))}

          {RIGHT_LAUNCH_THANKS.map((entry, index) => (
            <motion.div
              key={`right-thanks-${burstId}-${entry.label}`}
              initial={{ opacity: 0, x: 46, scale: 0.92 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [46, 0, -18],
                scale: [0.92, 1, 0.98],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.34,
                delay: index * 0.22 + 0.11,
                ease: "easeInOut",
              }}
              style={{ top: `${4 + index * 3.7}%` }}
              className="absolute right-4 whitespace-nowrap text-left font-black uppercase tracking-[0.16em] text-red-50/95 drop-shadow-[0_0_14px_rgba(255,45,45,0.48)] md:right-7"
            >
              <span className="inline-flex items-center gap-2 text-[0.78rem] md:text-[0.94rem]">
                <img
                  src={getLaunchFlagSrc(entry.flagCode)}
                  alt=""
                  className="h-[0.95rem] w-[1.28rem] rounded-[2px] object-cover shadow-[0_0_8px_rgba(255,255,255,0.12)] md:h-[1.05rem] md:w-[1.42rem]"
                  loading="lazy"
                  decoding="async"
                />
                <span>{entry.label}</span>
              </span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scaleY: 0.55 }}
            animate={{ opacity: [0, 0.35, 0], scaleY: [0.55, 1.1, 0.75] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            className="absolute inset-y-[10%] left-3 w-[2px] rounded-full bg-red-200/45 blur-[1px] md:left-6"
          />
          <motion.div
            initial={{ opacity: 0, scaleY: 0.55 }}
            animate={{ opacity: [0, 0.35, 0], scaleY: [0.55, 1.1, 0.75] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            className="absolute inset-y-[10%] right-3 w-[2px] rounded-full bg-red-200/45 blur-[1px] md:right-6"
          />

          <motion.img
            src={LAUNCH_WALKER_SRC}
            alt=""
            initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              x: [0, 0, 10, -8, 0],
              y: [0, 0, -12, -112, -210],
              scale: [1, 1, 0.98, 0.62, 0.24],
              rotate: [0, 0, -1.5, 1.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.9,
              delay: 6.7,
              ease: "easeInOut",
            }}
            className="absolute bottom-[9%] left-[2%] w-[132px] drop-shadow-[0_14px_20px_rgba(0,0,0,0.5)] sm:left-[4%] sm:w-[150px] lg:left-[5%] lg:w-[170px]"
          />

          {LAUNCH_SIDE_STICKERS.map((sticker) => (
            <motion.img
              key={`${burstId}-${sticker.src}`}
              src={sticker.src}
              alt=""
              initial={{ opacity: 0, scale: 0.68 }}
              animate={{
                opacity: [0, 0, 1, 1, 0],
                scale: [...sticker.scale],
                x: [...sticker.x],
                y: [...sticker.y],
                rotate: [...sticker.rotate],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.45,
                delay: sticker.delay,
                ease: "easeInOut",
              }}
              className={cn(
                "drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)]",
                sticker.className
              )}
            />
          ))}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default memo(LaunchFxOverlay);
