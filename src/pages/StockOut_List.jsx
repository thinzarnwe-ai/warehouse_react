import React from 'react'
import StockSearch from '../components/StockSearch'
import Stock_Out_List_md from '../components/Stock_Out_List_md'
import Stock_Out_List_sm from '../components/Stock_Out_List_sm'

export default function StockOut_List() {
  return (
    <>
      <StockSearch/>
      <Stock_Out_List_md/>
      <Stock_Out_List_sm/>
    </>
  )
}
