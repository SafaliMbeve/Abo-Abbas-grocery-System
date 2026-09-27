"use client"
import React, { useState } from "react"
import { AlignLeft } from 'lucide-react'
import { SideMenu } from './SideMenu'

 const MobileMenu = () => {
    const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  return (
    <>
    <button onClick={() => setIsSideBarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-dark hoverEffect md:hidden hover:cursor-pointer"/>
    </button> 

    <div className="md:hidden">
      <SideMenu 
      isOpen= {isSidebarOpen}
      onClose= {() => setIsSideBarOpen(false)}/>
    </div>

    </>
  );

};

export default MobileMenu;
