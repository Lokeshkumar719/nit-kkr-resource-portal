function buildMentorQuery(query) {
  const filter = {};

  if (query.currentYear) {
    filter.currentYear = query.currentYear;
  }

  if (query.branch) {
    filter.branch = query.branch;
  }

  if (query.tags) {
    const tags = Array.isArray(query.tags) ? query.tags : query.tags.split(",");

    filter.tags = {
      $in: tags,
    };
  }

  return filter;
}

module.exports = buildMentorQuery;
