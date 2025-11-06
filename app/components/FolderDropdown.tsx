'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFolderContext } from '../context/FolderContext';
import { FolderData } from '../types/image';

interface FolderDropdownProps {
  className?: string;
}

export default function FolderDropdown({ className = '' }: FolderDropdownProps) {
  const { folders, selectedFolder, isLoading, error, setSelectedFolder } = useFolderContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFolderSelect = (folder: FolderData) => {
    setSelectedFolder(folder);
    setIsOpen(false);
  };

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        Error loading folders: {error}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="w-full">
        <button
          type="button"
          className={`
            relative w-full min-w-[280px] cursor-pointer rounded-lg bg-white dark:bg-gray-800 
            py-3 pl-4 pr-10 text-left text-gray-900 dark:text-white shadow-sm 
            ring-1 ring-inset ring-gray-300 dark:ring-gray-600 
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors duration-200
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          disabled={isLoading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
            <span className="block truncate font-medium">
              {isLoading 
                ? 'Loading folders...' 
                : selectedFolder 
                  ? selectedFolder.name 
                  : 'Select a folder'
              }
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {folders.length === 0 ? (
              <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 dark:text-gray-400">
                No folders available
              </div>
            ) : (
              folders.map((folder) => (
                <div
                  key={folder.folderId}
                  className={`
                    relative cursor-pointer select-none py-3 pl-3 pr-9 
                    hover:bg-blue-50 dark:hover:bg-blue-900/20
                    transition-colors duration-150
                    ${selectedFolder?.folderId === folder.folderId 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200' 
                      : 'text-gray-900 dark:text-white'
                    }
                  `}
                  onClick={() => handleFolderSelect(folder)}
                  role="option"
                  aria-selected={selectedFolder?.folderId === folder.folderId}
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      />
                    </svg>
                    <span className="block truncate font-medium">
                      {folder.name}
                    </span>
                  </div>

                  {selectedFolder?.folderId === folder.folderId && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}