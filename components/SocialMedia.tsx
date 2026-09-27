
import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props{
    className?:string;
    iconClassName?:string;
    tooltipClassName?:string;
}
const socialLink = [
    {
        title:"Instagram",
        href:"https://www.instagram.com/?hl=en/@reactjsBD",
        icon:<FaInstagram aria-hidden="true" className="size-[18px]" />,
    },
    {
        title:"Facebook",
        href:"https://www.facebook.com/@reactjsBD",
        icon:<FaFacebookF aria-hidden="true" className="size-4" />,
    },
    {
        title:"X",
        href:"https://x.com/@reactjsBD",
        icon:<FaXTwitter aria-hidden="true" className="size-[17px]" />,
    },
    {
        title:"LinkedIn",
        href:"https://zm.linkedin.com/@reactjsBD",
        icon:<FaLinkedinIn aria-hidden="true" className="size-[18px]" />,
    },

];

const SocialMedia = ({className,iconClassName,tooltipClassName}:Props) => {
  return ( <TooltipProvider>
    <div className={cn("flex items-center gap-2.5", className)}>
        {socialLink?.map((item)=> (
        <Tooltip key={item?.title}>
            <TooltipTrigger render={
                <Link
                target="_blank"
                rel="noopener noreferrer" 
                href={item?.href}
                aria-label={item.title}
                className={cn(
                    "flex size-10 items-center justify-center rounded-full border border-current/20 bg-transparent text-current/80 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-shop-dark-red hover:bg-shop-dark-red hover:text-white hover:shadow-md hover:shadow-shop-dark-red/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red focus-visible:ring-offset-2 active:translate-y-0",
                    iconClassName
                )}>
                {item?.icon}
                </Link>
            } />
            <TooltipContent className={cn("bg-white text-dark font-semibold",tooltipClassName)}>
                {item?.title}
            </TooltipContent>
        </Tooltip>
   ))};
    </div>
  </TooltipProvider>
  );
};

export default SocialMedia;