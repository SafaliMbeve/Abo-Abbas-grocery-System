import React from "react"
import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <button
      type="button"
      aria-label="Search"
      className="rounded-full p-2 text-light transition-colors hover:bg-shop-light-bg hover:text-shop-dark-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red"
    >
      <Search className="size-5" />
    </button>
  );
  
}

export default SearchBar