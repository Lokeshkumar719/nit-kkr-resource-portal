export const formatMentorPayload = (formData) => {
  const payload = {
    name: formData.name.trim(),
    branch: formData.branch,
    currentYear: formData.year,
  };

  if (formData.year === 'Alumni' && formData.batchStart && formData.batchEnd) {
    payload.batch = `${formData.batchStart}-${formData.batchEnd}`;
  } else {
    payload.batch = '';
  }

  if (formData.email?.trim()) payload.email = formData.email.trim();
  else payload.email = '';

  if (formData.imageUrl?.trim()) payload.image = formData.imageUrl.trim();
  else payload.image = '';

  if (formData.linkedin?.trim()) payload.linkedin = formData.linkedin.trim();
  else payload.linkedin = '';

  if (formData.company?.trim()) {
    payload.experiences = [
      { company: formData.company.trim(), role: 'Employee', type: 'Placement' },
    ];
  } else {
    payload.experiences = [];
  }

  if (formData.achievements?.trim()) {
    payload.achievements = formData.achievements
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a);
  } else {
    payload.achievements = [];
  }

  if (formData.tags && formData.tags.length > 0) {
    payload.tags = formData.tags;
  } else {
    payload.tags = [];
  }

  return payload;
};

export const parseMentorToForm = (m) => {
  let batchStart = '',
    batchEnd = '';
  if (m.currentYear === 'Alumni' && m.batch) {
    const parts = m.batch.split('-');
    if (parts.length === 2) {
      batchStart = parts[0];
      batchEnd = parts[1];
    }
  }

  return {
    name: m.name,
    email: m.email || '',
    branch: m.branch,
    year: m.currentYear,
    company: m.experiences?.[0]?.company || '',
    linkedin: m.linkedin || '',
    imageUrl: m.image || '',
    achievements: m.achievements ? m.achievements.join(', ') : '',
    tags: m.tags || [],
    batchStart,
    batchEnd,
  };
};
