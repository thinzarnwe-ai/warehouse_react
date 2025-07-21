import React from 'react'

export default function Detail_md({ stock }) {
  if (!stock) return <div>Loading...</div>;

  return (
    <>
      <table className="table-auto w-150 mx-auto">
        <thead>
            <tr>
            <th className="px-4 py-2">Detail Page</th>
            {/* <th class="px-4 py-2">Author</th>
            <th class="px-4 py-2">Views</th> */}
            </tr>
        </thead>
        <tbody className='bg-white rounded-2xl '>
            <tr>
            <td className=" px-4 py-2">Product Code</td>
            <td className=" px-4 py-2">{stock[0].product_code}</td>
            </tr>
                
            <tr>
            <td className=" px-4 py-2">Product Name</td>
            <td className=" px-4 py-2">{stock[0].product_name}</td>
            </tr>
             <tr>
            <td className=" px-4 py-2">Product Name</td>
            <td className=" px-4 py-2">{stock[0].product_name}</td>
            </tr>
             <tr>
            <td className=" px-4 py-2">Product Name</td>
            <td className=" px-4 py-2">{stock[0].product_name}</td>
            </tr>
             <tr>
            <td className=" px-4 py-2">Product Name</td>
            <td className=" px-4 py-2">{stock[0].product_name}</td>
            </tr>
        </tbody>
        </table>
    </>
  );
}

