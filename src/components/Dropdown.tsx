import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function SearchDropdown({text, data}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  


  const filtereddata = data.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-64">
      <div 
        className="flex items-center w-full cursor-pointer text-white bg-gray-900 border rounded-lg px-3 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          className="flex-1 outline-none border-none bg-transparent"
          placeholder={text}
          value={search}
          onChange={(e) => {
            e.stopPropagation();
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        />
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto z-10 text-red-500 font-semibold">
          {filtereddata.length > 0 ? (
            filtereddata.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearch(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;