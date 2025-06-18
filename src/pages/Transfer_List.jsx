import React from 'react'
import StockSearch from '../components/StockSearch'
import Transfer_List_sm from '../components/Transfer_List_sm'
import Transfer_List_md from '../components/Transfer_List_md'


export default function Transfer_List() {
  return (
    <>
        <StockSearch/>
        <Transfer_List_md/>
        <Transfer_List_sm/>
    </>
  )
}
