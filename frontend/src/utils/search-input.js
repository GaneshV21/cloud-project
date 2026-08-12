import React from "react";
import { CustomInput } from "./custom-input";

function SearchInput({ searchValue, setSearchValue }) {
  return (
    <>
      <CustomInput
        placeholder="Search Anything"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
    </>
  );
}

export default SearchInput;
