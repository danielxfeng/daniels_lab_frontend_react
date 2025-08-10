import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import SafeStyledMarkdown from '@/components/features/post/SafeStyledMarkdown';
import MotionH1 from '@/components/motion_components/MotionH1';
import LazyImage from '@/components/shared/LazyImage';
import { GlowingEffect } from '@/components/third_party/GlowingEffect';
import { Badge } from '@/components/ui/badge';
import rawProjects from '@/constants/projects.json';
import { featuredProjectsAnimation } from '@/lib/animations';
import { throwWithUserValidationErr } from '@/lib/throwWithErr';
import { ProjectsSchema } from '@/schema/schema_json';

/**
 * @summary A grid of projects
 */
const ProjectCards = ({ position }: { position: 'page' | 'div' }) => {
  const parsedProjects = ProjectsSchema.safeParse(rawProjects);
  if (parsedProjects.error) {
    throwWithUserValidationErr('error on parsing project data', parsedProjects.error);
    return null;
  }

  const projects = parsedProjects.data;

  return (
    <section data-role='projects-section' className='inner-container py-6'>
      {/* h1 or h2 depends on the position of component */}
      {position === 'div' ? (
        <h2 className='text-gradient my-3'>Featured Projects</h2>
      ) : (
        <MotionH1 className='my-3'>Featured Projects</MotionH1>
      )}

      <div
        data-role='projects-list'
        className='mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3'
      >
        {projects.map((project) => (
          <Link to={project.projectLink} key={project.id}>
            <motion.article
              data-role='project-card'
              className='border-muted relative flex h-full flex-col justify-between gap-3 rounded-xl border p-5 shadow-sm'
              {...featuredProjectsAnimation}
            >
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div data-role='project-card-top' className='flex flex-col justify-start'>
                {/* Picture of project */}
                <LazyImage
                  src={project.coverUrl}
                  alt={project.title}
                  className='aspect-[1200/630] w-full rounded-lg shadow-xl'
                />
                {/* Title of project */}
                <h4 className='text-gradient my-8 text-center !font-bold'>{project.title}</h4>
                {/* The description of project */}
                <SafeStyledMarkdown markdown={project.description} className='bold-bigger' />
              </div>

              <div
                data-role='project-card-bottom'
                className='flex flex-col justify-end gap-5 text-sm'
              >
                <hr className='text-muted'></hr>
                {/* Tech stacks */}
                <p
                  data-role='project-stacks'
                  className='flex flex-wrap justify-center gap-1.5 font-semibold italic'
                >
                  {project.stack.map((s) => (
                    <Badge key={s} variant='secondary' className='bg-muted/40 rounded-full'>
                      {s}
                    </Badge>
                  ))}
                </p>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProjectCards;
