import React from 'react'

export default function SearchField() {
  return (
    <div className="relative inline-block search_main_cont text-left">
        <div
            id="dropdownButton"
            className="inline-flex main_input w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100"
            // onclick="toggleDropdown()"
        >
            <div className="first_search">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 17L13.889 13.8889M16.1111 8.55556C16.1111 12.7284 12.7284 16.1111 8.55556 16.1111C4.38274 16.1111 1 12.7284 1 8.55556C1 4.38274 4.38274 1 8.55556 1C12.7284 1 16.1111 4.38274 16.1111 8.55556Z" stroke="#CDE9DF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                
                <div className="selected_dr">
                    <img src="/assets/images/dr-remirez.png" alt="" />
                    <h4>Dr. Adam Smith</h4>
                </div>
            </div>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1" stroke="#B6F09C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

        </div>

        <div
            id="dropdownMenu"
            className="absolute main_drop  right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden"
        >
            <div className="py-1 px-3">
                <div className="drop_list_schedule hover:bg-gray-100">
                    <img src="/assets/images/dr-remirez.png" alt="" />

                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                    >
                        Dr. Adam Smith
                    </a>

                </div>
                <div className="drop_list_schedule hover:bg-gray-100">
                    <img src="/assets/images/dr-remirez.png" alt="" />

                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                    >
                        Dr. Adam Smith
                    </a>

                </div>
                
            </div>
        </div>
    </div>

  )
}
