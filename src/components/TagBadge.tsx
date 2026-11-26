import React from 'react';
import { TagType } from '../lib/types';

interface TagBadgeProps {
  tag: TagType;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, className = '' }) => {
  if (tag === 'Official') {
    return (
      <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border border-[#2a5fb0] text-[#2a5fb0] bg-[#eef4fc] ${className}`}>
        Official
      </span>
    );
  }
  if (tag === 'Data') {
    return (
      <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border border-[#1f7a5c] text-[#1f7a5c] bg-[#eef8f4] ${className}`}>
        Data
      </span>
    );
  }
  return (
    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border border-[#b7660a] text-[#b7660a] bg-[#fff8ef] ${className}`}>
      Assumption
    </span>
  );
};
