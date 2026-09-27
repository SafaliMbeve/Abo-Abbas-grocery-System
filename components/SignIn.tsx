import React from "react"
import { SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
    <button className="text-sm font-semibold text-shop-light-red hover:cursor-pointer hover:text-dark hoverEffect">Login</button>
     </SignInButton>);
  
};

export default SignIn;