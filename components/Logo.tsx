import React from 'react'
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = ({className, spanDesign}: {className?: string, spanDesign?:string}) => {
  return <Link href={"/"} className="inline-flex">
    <h2 className={cn("text-2xl text-shop-dark-red font-black tracking-wider uppercase hover:text-shop-light-red hoverEffect group font-sans",className)}
    >Abo Abba<span className={cn("text-shop-light-red group-hover:text-shop-dark-red hoverEffect", spanDesign)}>s</span></h2>
  </Link>;
};

export default Logo