'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFolderContext } from '../context/FolderContext';
import { FolderData } from '../types/image';
import { FolderIcon, ChevronDownIcon, CheckmarkIcon } from './icons';

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
            <FolderIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
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
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
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
                    <FolderIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                    <span className="block truncate font-medium">
                      {folder.name}
                    </span>
                  </div>

                  {selectedFolder?.folderId === folder.folderId && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                      <CheckmarkIcon className="h-5 w-5" />
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