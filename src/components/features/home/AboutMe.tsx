import MotionBlurCard from '@/components/motion_components/MotionBlurCard';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionSpan from '@/components/motion_components/MotionSpan';
import ContactLink from '@/components/shared/ContactLink';
import { GlowingEffect } from '@/components/third_party/GlowingEffect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import contactIconList from '@/constants/contactLinks';
import siteMeta from '@/constants/siteMeta';
import rawTechStack from '@/constants/techStack.json';

const techStack = rawTechStack;

const AboutMe = ({ position }: { position: 'page' | 'div' }) => {
  return (
    <section
      data-role='about-me-section'
      className='inner-container flex flex-col text-lg leading-relaxed lg:my-6'
    >
      {/* h1 or h2 based on the position */}
      {position === 'div' ? <h2 className='my-6'>About Me</h2> : <MotionH1>About Me</MotionH1>}

      <div data-role='about-me-content' className='flex w-full flex-col items-center gap-6 py-8'>
        {/* Introduction */}
        <section
          data-role='about-me-introduction'
          className='mb-8 flex w-full max-w-2xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-12'
        >
          <div
            data-role='about-me-avatar'
            className='flex flex-col items-center justify-center gap-3'
          >
            <Avatar className='ring-offset-background ring-muted z-5 h-32 w-32 shadow-xl ring-2 ring-offset-2 lg:h-40 lg:w-40'>
              <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
              <AvatarFallback>Daniel</AvatarFallback>{' '}
            </Avatar>
            <div className='flex justify-between' data-role='about-me-avatar-contact-links'>
              {contactIconList.map((prop) => (
                <ContactLink key={prop.supportText} {...prop} />
              ))}
            </div>
          </div>

          <div
            data-role='about-me-introduction-content'
            className='border-border text-foreground/65 [&_strong]:text-foreground relative w-full rounded-2xl border bg-white p-6 italic shadow-md dark:bg-neutral-950 [&_strong]:not-italic'
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <p>
              <strong className='mb-2 block'>Hey!</strong> I am{' '}
              <MotionSpan
                text={siteMeta.me}
                className='text-highlight px-2 py-1 text-3xl font-bold text-shadow-md'
                delay={0.08}
              />
            </p>
            <p>
              <strong>CS student · Helsinki</strong>
            </p>
            <p>
              I focus on full stack <strong>web development</strong>, and also enjoy{' '}
              <strong>system programming</strong> and building <strong>AI</strong> toys.
            </p>
          </div>
        </section>

        <div
          data-role='about-me-detail'
          className='text-foreground/65 [&_strong]:text-foreground flex max-w-5xl flex-col gap-12 italic lg:flex-row [&_strong]:not-italic'
        >
          <MotionBlurCard
            dataRole='about-me-profession'
            className='flex w-full flex-1 flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-950'
          >
            <ul className='list-disc space-y-2 pl-6'>
              <li>
                Studying at <strong>Hive Helsinki</strong>, focusing on system-level{' '}
                <strong>C/C++</strong> projects.
              </li>
              <li>
                Pursuing a Bachelor's degree in Computer Applications at <strong>HAMK</strong>.
              </li>
            </ul>

            <ul className='list-disc space-y-2 pl-6'>
              <li>
                Worked in <strong>corporate banking</strong> in <strong>Shanghai</strong> until
                August 2023.
              </li>
            </ul>
          </MotionBlurCard>

          <div className='bg-muted hidden w-px lg:flex' />

          <MotionBlurCard
            dataRole='about-me-detail-soft'
            className='flex w-full flex-1 flex-col justify-start gap-6 rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-950'
          >
            {/* Soft skill */}
            <ul className='list-disc space-y-2 pl-6'>
              <li>
                <strong>Naturally curious</strong>: I enjoy learning new things and exploring
                unfamiliar ideas.
              </li>
              <li>
                <strong>Logical thinker</strong>: I love breaking down complex problems with
                structured reasoning.
              </li>
              <li>
                <strong>Excellent teamwork</strong>: and collaboration skills in cross-functional
                environments.
              </li>
              <li className='mt-4 list-none pl-0'>-- I love becoming a little better every day.</li>
            </ul>
          </MotionBlurCard>
        </div>

        {/* Tech Stacks */}
        <section
          data-role='about-me-tech'
          className='flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-around'
        >
          <div data-role='about-me-tech-stack' className='mt-10 flex flex-col gap-4 lg:gap-2'>
            <h4 className='mb-4 flex justify-start items-center gap-1.5'>
              <span className='not-italic'>⭐</span>
              <span className='italic'>Tech stacks</span>
            </h4>
            {techStack.map((item) => (
              <div key={item.title} className='mb-2 flex items-center gap-2'>
                <div className='text-muted-foreground font-semibold italic'>
                  <span>{item.title}</span>
                  <span>: </span>
                </div>
                <div className='flex flex-wrap gap-2 text-sm font-medium'>
                  {item.stacks.map((value) => (
                    <span key={value} className='bg-highlight/30 rounded-full px-2 py-0.5'>
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div data-role='aws-badge' className='relative h-32 w-32 overflow-hidden'>
            <div className='absolute -top-2 -left-2'>
              <div
                data-iframe-width='150'
                data-iframe-height='270'
                data-share-badge-id='97f12050-a9d4-46b3-9754-cb82aacd5a6f'
                data-share-badge-host='https://www.credly.com'
              ></div>
            </div>
          </div>
        </section>
      </div>
      {/* AWS badge */}
      <script
        type='text/javascript'
        async
        src='//cdn.credly.com/assets/utilities/embed.js'
      ></script>
    </section>
  );
};

export default AboutMe;
