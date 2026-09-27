import React from "react";
import{ Clock, Mail, MapPin, Phone} from "lucide-react";

interface ContactItemData{
    title: string;
    subtitle: string;
    icon:React.ReactNode;
}

const data: ContactItemData[] = [
    {
        title: "Visit Us",
        subtitle: " Makeni, Lusaka, Zambia",
        icon: <MapPin className="size-5 text-shop-dark-red transition-colors"/>,
    },
    {
        title: "Call Us",
        subtitle: "+260 779 233 082",
        icon: <Phone className="size-5 text-shop-dark-red transition-colors"/>
    },
    {
        title:"Working Hours",
        subtitle:"Mon - Sat: 08:00am - 10:00pm",
        icon: <Clock className="size-5 text-shop-dark-red transition-colors"/>
    },
    {
        title:"Email Us",
        subtitle:"aboabbasshop@gmail.com",
        icon: <Mail className="size-5 text-shop-dark-red transition-colors"/>
    },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-black/[0.06] py-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {data?.map((item, index)=>(
            <div key={index} className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-shop-light-bg">
                {item?.icon}
        
               <div>
                  <h3 className="font-semibold text-dark">{item?.title}</h3>
                  <p className="mt-1 text-sm text-shop_light_text">{item?.subtitle}</p>
               </div>
            </div>
        ))}
    </div>
  )
};

export default FooterTop