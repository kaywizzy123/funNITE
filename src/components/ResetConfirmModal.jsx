import { useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppContext } from "../context/AppContext";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function ResetConfirmModal() {
  const { resetModalOpen, confirmResetModal, cancelResetModal } = useContext(AppContext);

  return (
    <AnimatePresence>
      {resetModalOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={cancelResetModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-4 w-full max-w-sm bg-neutral-900 border border-neutral-500/30 rounded-2xl p-6 text-center"
          >
            <h3 className="text-xl font-bold">Start a new tournament?</h3>
            <p className="text-sm text-neutral-400">
              This will clear the current one, including any scores already
              entered.
            </p>
            <div className="flex justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={cancelResetModal}
                className="bg-neutral-700 rounded-full px-5 py-2 transition-all duration-300 hover:bg-neutral-600 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResetModal}
                className="bg-red-500 rounded-full px-5 py-2 text-white transition-all duration-300 hover:bg-red-600 active:scale-95"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
