import React from 'react';
import { MoreVertical } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  online: boolean;
  lastMessage: string;
  lastTime: string;
}

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export function ContactList({
  contacts,
  onContactSelect,
  onTagSelect,
  selectedTags
}: ContactListProps) {
  const handleContactClick = (contact: Contact) => {
    onContactSelect(contact);
  };

  return (
    <div className="divide-y divide-gray-200">
      {contacts.map(contact => (
        <div
          key={contact.id}
          className="flex items-center p-4 bg-white hover:bg-gray-50 cursor-pointer"
          onClick={() => handleContactClick(contact)}
        >
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-12 h-12 rounded-full"
            />
            {contact.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="font-medium">{contact.name}</h3>
              <span className="text-xs text-gray-500">{contact.lastTime}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{contact.lastMessage}</p>
            <div className="flex items-center space-x-2 mt-1">
              {contact.tags.map(tag => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagSelect(tag);
                  }}
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            className="p-2"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
