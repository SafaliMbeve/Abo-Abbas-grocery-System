import React from "react";
import Container from './Container';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import FavoriteButton from './FavoriteButton';
import SignIn from './SignIn';
import MobileMenu from './MobileMenu';
import { currentUser } from '@clerk/nextjs/server';
import { ClerkLoaded, Show, UserButton } from '@clerk/nextjs';

const Header = async() => {
    const user = await currentUser()

  return (
    <header className="sticky top-0 z-50 border-b border-black/6 bg-white/90 py-3 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex items-center justify-between text-light">
         <div className="flex w-auto items-center justify-start gap-2.5 md:w-1/3 md:gap-0">
            <MobileMenu/>
            <Logo/>
         </div>
         <HeaderMenu/>
           <div className="flex w-auto items-center justify-end gap-3 md:w-1/3 md:gap-5">
              <SearchBar/>
              <CartIcon/>
              <FavoriteButton/>
              <ClerkLoaded>
                <Show when="signed-in">
                    <UserButton/>
                </Show>
                {!user && <SignIn/>}
              </ClerkLoaded>
           </div>
         {/*navadmin*/}
     </Container>
    </header>
  );
  
}

export default Header