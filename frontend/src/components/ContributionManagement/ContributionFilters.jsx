import React from 'react';
import { RESOURCE_TYPES } from '../../constants/index.js';
import PillFilterBar from '../admin/filters/PillFilterBar.jsx';

export default function ContributionFilters({ contributions, currentFilter, onFilterChange }) {
  const getContributionCount = (type) => {
    if (type === 'ALL') return contributions.length;
    return contributions.filter((c) => c.type === type).length;
  };

  const options = ['ALL', ...RESOURCE_TYPES.map((r) => r.value)];

  return (
    <PillFilterBar
      options={options}
      currentValue={currentFilter}
      onChange={onFilterChange}
      getCount={getContributionCount}
    />
  );
}
