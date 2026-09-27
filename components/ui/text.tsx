import { cn } from "@/lib/utils"

const Title=({children, className}:{children:React.ReactNode, className?:string})=>{
    return (
    <h2 className={cn("font-sans text-2xl font-semibold tracking-tight text-dark sm:text-3xl", className)}>{children}</h2>
    );
};

const Subtitle=({children, className}:{children:React.ReactNode, className?:string})=>{
    return (
    <h3 className={cn("font-sans font-semibold text-dark", className)}>{children}</h3>
    );
};

const Subtext=({children, className}:{children:React.ReactNode, className?:string})=>{
    return <p className={cn("text-sm leading-6 text-shop_light_text", className)}>{children}</p>
}
export{Title, Subtitle, Subtext};