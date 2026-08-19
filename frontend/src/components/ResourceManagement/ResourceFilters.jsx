import React from 'react';
import { RESOURCE_TYPES } from '../../constants/index.js';
import PillFilterBar from '../admin/filters/PillFilterBar.jsx';

export default function ResourceFilters({ resources, currentFilter, onFilterChange }) {
  const getResourceCount = (type) => {
    if (type === 'ALL') return resources.length;
    return resources.filter((r) => r.type === type).length;
  };

  const options = ['ALL', ...RESOURCE_TYPES.map((t) => t.value)];

  return (
    <PillFilterBar
      options={options}
      currentValue={currentFilter}
      onChange={onFilterChange}
      getCount={getResourceCount}
      className="mb-6"
    />
  );
}
