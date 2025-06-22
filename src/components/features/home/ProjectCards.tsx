import { Link } from 'react-router-dom';

import SafeStyledMarkdown from '@/components/features/post/SafeStyledMarkdown';
import MotionWobbleCard from '@/components/motion_components/MotionWobbleCard';
import LazyImage from '@/components/shared/LazyImage';
import rawProjects from '@/constants/projects.json';
import { throwWithUserValidationErr } from '@/lib/throwWithErr';
import { ProjectsSchema } from '@/schema/schema_json';

/**
 * @summary A grid of projects
 */
const ProjectCards = () => {
  const parsedProjects = ProjectsSchema.safeParse(rawProjects);
  if (parsedProjects.error) {
    throwWithUserValidationErr(
      'error on parsing project data',
      JSON.stringify(parsedProjects.error),
    );
    return null;
  }

  const projects = parsedProjects.data;

  return (
    <section data-role='projects-section' className='inner-container py-6'>
      <h2 className='my-3'>Projects</h2>
      <div
        data-role='projects-list'
        className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
      >
        {projects.map((project) => (
          <Link to={project.link}>
            <MotionWobbleCard containerClassName='h-full dark:border-muted dark:border dark:lg:border-none'>
              <article
                data-role='project-card'
                key={project.id}
                className='flex h-full flex-col justify-between gap-3'
              >
                <div data-role='project-card-top' className='flex flex-col justify-start'>
                  <LazyImage
                    src={project.coverUrl}
                    alt={project.title}
                    className='aspect-[2/1] w-full rounded-lg shadow-xl'
                  />
                  <h4 className='text-shadow mt-5 mb-3 text-center'>{project.title}</h4>
                  <SafeStyledMarkdown
                    markdown={project.description}
                    className='text-muted-foreground text-sm'
                  />
                </div>
                <div
                  data-role='project-card-bottom'
                  className='flex flex-col justify-end gap-5 text-sm'
                >
                  <hr className='text-muted'></hr>
                  <p
                    data-role='project-stacks'
                    className='flex flex-wrap justify-center gap-1.5 font-semibold italic'
                  >
                    {project.stack.map((s) => (
                      <span
                        data-role='project-stack'
                        key={s}
                        className='bg-muted/40 rounded-full px-2 py-1 text-xs'
                      >
                        {s}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            </MotionWobbleCard>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProjectCards;
