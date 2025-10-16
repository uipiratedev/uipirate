import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

const AnimatedButton = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }} // Button scales on hover
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="inline-block" // Keeps the button's scale effect smooth
    >
      <Button className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 group">
        <div className="flex flex-row gap-2 items-center">
          <motion.img
            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729761707/vishal_profile_d2fbyt.svg"
            alt="Dribble Logo"
            className="w-auto h-[30px]"
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          />

          <motion.p
            className="text-[#5B5B5B] text-xl font-bold"
            initial={{ x: 20, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          >
            +
          </motion.p>

          <motion.img
            src="https://res.cloudinary.com/damm9iwho/image/upload/v1730289917/Frame_1984078767_sjyim4.svg"
            alt="Dribble Logo"
            className="w-auto h-[30px]"
            initial={{ x: 20, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
        Book a 15-min call
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
