import React from "react";
import Stock_List_md from "../components/Stock_List_md";
import Stock_List_sm from "../components/Stock_List_sm";
import Search from "../components/Search";

export default function Home() {

  return (
    <>
      <Search/>
      <Stock_List_md/>
      <Stock_List_sm/>
    </>
  );
}
