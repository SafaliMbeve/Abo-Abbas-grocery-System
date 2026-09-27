"use client";

import { useEffect } from "react";
import useStore from "@/store";

export default function ClearCartOnPaid() {
  const resetCart = useStore((state) => state.resetCart);

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  return null;
}
