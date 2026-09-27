import { buildTechRows } from './tech-rows';

const tags = (rows: ReturnType<typeof buildTechRows>) => ({
  technologies: rows.technologies.map((badge) => badge.tag),
  fields: rows.fields.map((badge) => badge.tag),
});

describe('buildTechRows', () => {
  it('splits technologies from fields, in the curated order whatever order the API uses', () => {
    expect(tags(buildTechRows(['vue', 'backend', 'angular', 'docker', 'react']))).toEqual({
      technologies: ['angular', 'react', 'vue'],
      fields: ['backend', 'docker'],
    });
  });

  it('leaves out tags without a badge, like the levels', () => {
    expect(tags(buildTechRows(['beginner', 'advanced', 'angular', 'something-new']))).toEqual({
      technologies: ['angular'],
      fields: [],
    });
  });

  it('shows nothing until the catalog has answered', () => {
    expect(tags(buildTechRows([]))).toEqual({ technologies: [], fields: [] });
  });
});
