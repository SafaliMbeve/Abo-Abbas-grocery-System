"use client";

import{cn} from "@/lib/utils"
import{ motion} from "framer-motion"
import { Loader2 } from "lucide-react"

const NoProductAvailable = ({
    selectedTab,
    className,
}: {
    selectedTab?: string;
    className?: string;
}) => {
    return (
        <div className={cn(
            "mt-8 flex min-h-80 w-full flex-col items-center justify-center space-y-4 rounded-2xl border border-black/[0.05] bg-shop-light-bg px-5 py-10 text-center", className
        )}
        >
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold tracking-tight text-dark">
                    No Product Available
                </h2>
            </motion.div>

            <motion.p 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay:0.2, duration:0.5}}
            className="text-shop_light_text"
            >
                We&apos;re sorry, but there are not products matching on {""}
                <span className="text-base font-semibold text-dark">
                    {selectedTab}
                </span>{""} 
                      criteria at the moment
            </motion.p>

            <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5}}
            className="flex items-center gap-2 text-shop-dark-red"
            >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>We&apos;re restocking shortly</span>
            </motion.div>

            <motion.p
            initial={{opacity: 0 }}
            animate={{opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5}}
            className="text-sm text-shop_light_text"
            >
                Please check back later or explore our other product categories
            </motion.p>
        </div>
    );
};

export default NoProductAvailable;