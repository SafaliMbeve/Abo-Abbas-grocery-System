import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Logo from "./Logo"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "./ui/button"

const NoAccessToCart = ({details="Log in to view your cart items and checkout. Don't miss out on your favorite products!"}) => {
  return (
    <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6">
        <Card className="w-full max-w-md gap-0 rounded-2xl border border-black/6 bg-white p-2 shadow-xl shadow-black/4">
            <CardHeader className="flex flex-col items-center gap-3 px-5 pb-3 pt-6 sm:px-8">
                <Logo/>
                <CardTitle className="text-center text-2xl font-bold tracking-tight text-dark">Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-5 pb-5 sm:px-8">
                <p className="text-center text-sm leading-6 text-shop_light_text">{details}</p>
            <SignInButton mode="modal">
                <Button className="w-full" size="lg">Sign In</Button>
            </SignInButton>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 rounded-xl bg-shop-light-bg px-5 py-5 sm:px-8">
                <div className="text-center text-sm text-muted-foreground">
                    Don&rsquo;t have an account?
                </div>
                <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full" size="lg">
                        Create an account
                    </Button>
                </SignUpButton>
            </CardFooter>
        </Card>
    </div>
  )
}

export default NoAccessToCart