import React from 'react'
import Container from './Container';
import FooterTop from './FooterTop';
import Logo from './Logo';
import SocialMedia from './SocialMedia';
import { Subtext, Subtitle } from './ui/text';
import { categoriesData, quickLinksData } from '@/constants/data';
import Link from 'next/link';
import FooterNewsletter from './FooterNewsletter';

const Footer = () => {
  return (
  <footer className="border-t border-black/[0.06] bg-white">
    <Container>
        <FooterTop/>
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
            <div className="space-y-4">
                <Logo/>
                <Subtext>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam ratione voluptatum, nisi quae doloremque cupiditate enim atque commodi libero, ex dolore eveniet, nobis impedit sed modi maxime excepturi consequuntur rerum.</Subtext>
                <SocialMedia className="text-dark/60"
                tooltipClassName="bg-dark text-white"/>
            </div>
            <div>
                <Subtitle className="font-semibold">Quick Links</Subtitle>
                <ul className="space-y-3 mt-4 text-sm font-poppins">
                    {quickLinksData?.map((item)=>(
                        <li key={item?.title}>
                            <Link href={item?.href} className="font-medium text-shop_light_text transition-colors hover:text-shop-dark-red">
                                {item?.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                 <Subtitle className="font-semibold">Categories</Subtitle>
                <ul className="space-y-3 mt-4 text-sm font-poppins">
                    {categoriesData?.map((item)=>(
                        <li key={item?.title}>
                            <Link href={`/category/${item?.href}`} className="font-medium text-shop_light_text transition-colors hover:text-shop-dark-red">
                                {item?.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-4">
                <FooterNewsletter />
            </div>
        </div>
    </Container>
  </footer>
  );

};

export default Footer