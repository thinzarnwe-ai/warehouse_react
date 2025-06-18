import React from 'react'

export default function Stock_Out_List_md() {
  return (
    <>
       <div className="relative overflow-x-auto px-4 hidden md:block min-h-screen  ">
        <table className="w-full  text-left rtl:text-right font-poppin mt-5 shadow-2xl">
          <thead className=" text-gray-800 uppercase bg-gray-50 border-b border-indigo-500 ">
            <tr>
              <th scope="col" className="px-6 py-5">
                No
              </th>
              <th scope="col" className="px-6 py-5">
                Product Code
              </th>
              <th scope="col" className="px-6 py-5">
                Product Name
              </th>
              <th scope="col" className="px-6 py-5">
                Category
              </th>
              <th scope="col" className="px-6 py-5">
                Qty
              </th>
              <th scope="col" className="px-6 py-5">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                className="px-6 py-4  text-gray-900 whitespace-nowrap dark:text-white"
              >
                1
              </th>
              <td className="px-6 py-5">002112999111122</td>
              <td className="px-6 py-5">Surface Corvering</td>
              <td className="px-6 py-5">Surface Corvering</td>
              <td className="px-6 py-5">100</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="px-6 py-5">00200122223331</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">150</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                3
              </th>
              <td className="px-6 py-5">221331112222</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">200</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                4
              </th>
              <td className="px-6 py-5">221331112222</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">200</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                5
              </th>
              <td className="px-6 py-5">221331112222</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">200</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                6
              </th>
              <td className="px-6 py-5">221331112222</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">200</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                7
              </th>
              <td className="px-6 py-5">221331112222</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">200</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-5 text-gray-900 whitespace-nowrap dark:text-white"
              >
                8
              </th>
              <td className="px-6 py-5">221331112222</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">Surfacing Covering</td>
              <td className="px-6 py-5">200</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
