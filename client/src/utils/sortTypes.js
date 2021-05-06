export const sortTypes = [
  { type: 'Created Newest', val: 'Date created (newest first)' },
  { type: 'Created Oldest', val: 'Date created (oldest first)' },
  { type: 'Modified Newest', val: 'Last updated (newest first)' },
  { type: 'Modified Oldest', val: 'Last updated (oldest first)' },
  { type: 'AtoZ', val: 'Alphabetically (A to Z)' },
  { type: 'ZtoA', val: 'Alphabetically (Z to A)' }
];

export const isReverseType = (oldType, newType) => {
  if (oldType.includes('C') && newType.includes('C')) {
    return true;
  }
  if (oldType.includes('M') && newType.includes('M')) {
    return true;
  }
  if (oldType.includes('Z') && newType.includes('Z')) {
    return true;
  }
  return false;
};

export const isModSort = sortType => (
  sortType === 'Modified Newest' || sortType === 'Modified Oldest'
);

export const isCreateSort = sortType => (
  sortType === 'Created Newest' || sortType === 'Created Oldest'
);
