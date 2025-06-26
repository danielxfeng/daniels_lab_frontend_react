import MotionBlurCard from '@/components/motion_components/MotionBlurCard';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionSpan from '@/components/motion_components/MotionSpan';
import { GlowingEffect } from '@/components/third_party/GlowingEffect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import siteMeta from '@/constants/siteMeta';
import rawTechStack from '@/constants/techStack.json';
import { cn } from '@/lib/utils';

const highlightText = 'text-foreground text-xl font-semibold px-1';
const normalText = 'text-foreground/65 px-1 italic';

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
          <Avatar className='ring-offset-background ring-muted z-5 h-40 w-40 shadow-xl ring-2 ring-offset-2'>
            <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
            <AvatarFallback>Daniel</AvatarFallback>{' '}
          </Avatar>

          <div
            data-role='about-me-introduction-content'
            className='border-border relative w-full rounded-2xl border bg-white p-6 shadow-md dark:bg-neutral-950'
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <p>
              <span className={cn(highlightText, 'block lg:inline-block')}>Hey!</span>
              <span className={normalText}> I am</span>
              <MotionSpan
                text={siteMeta.me}
                className='text-highlight px-2 py-1 text-3xl font-bold text-shadow-md'
                delay={0.08}
              />
            </p>
            <p>
              <span className={highlightText}>{'CS student  ·  Helsinki'}</span>
            </p>
            <p>
              <span className={cn(normalText, 'pl-0')}>I focus on</span>
              <span className={highlightText}>full stack</span>
              <span className={normalText}>
                development, both backend and frontend, and also enjoy
              </span>
              <span className={highlightText}>system programming</span>
              <span className={normalText}>and building</span>
              <span className={highlightText}>AI</span>
              <span className={normalText}>toys.</span>
            </p>
          </div>
        </section>

        <div data-role='about-me-detail' className='flex max-w-5xl flex-col gap-12 lg:flex-row'>
          <MotionBlurCard
            dataRole='about-me-detail-left'
            className='flex w-full flex-1 flex-col justify-start gap-3 rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-950'
          >
            {/* Education Hive */}
            <section data-role='about-me-education-hive'>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>I am now studying in</span>
                <span className={highlightText}>Hive Helsinki</span>
                <span className={cn(normalText, 'pl-0')}>, working on system-level</span>
                <span className={highlightText}>C/C++</span>
                <span className={cn(normalText, 'pl-0')}>projects.</span>
              </p>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>
                  These projects pushed me to design, debug, and build robust software, which
                  greatly improved my real-world programming skills.
                </span>
              </p>
            </section>

            {/* Education HAMK */}
            <section data-role='about-me-education-hamk'>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>I am also studying CS courses at</span>
                <span className={highlightText}>HAMK</span>
                <span className={cn(normalText, 'pl-0')}>.</span>
              </p>
            </section>

            {/* Work */}
            <section data-role='about-me-work'>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>Before August 2023, I worked in</span>
                <span className={highlightText}>corporate banking</span>
                <span className={normalText}>in</span>
                <span className={highlightText}>Shanghai</span>
                <span className={cn(normalText, 'pl-0')}>.</span>
              </p>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>
                  This experience helped me build strong
                </span>
                <span className={highlightText}>logical thinking</span>
                <span className={normalText}>for</span>
                <span className={highlightText}>breaking down</span>
                <span className={normalText}>complex problems, and the ability to</span>
                <span className={highlightText}>work in a team</span>
                <span className={normalText}>.</span>
              </p>
            </section>
          </MotionBlurCard>

          <div className='bg-muted hidden w-px lg:flex' />

          <MotionBlurCard
            dataRole='about-me-detail-right'
            className='flex w-full flex-1 flex-col justify-start gap-6 rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-950'
          >
            {/* Soft skill */}
            <section data-role='about-me-soft-skill'>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>I'm naturally</span>
                <span className={highlightText}>curious</span>
                <span className={normalText}>and enjoy</span>
                <span className={highlightText}>learning</span>
                <span className={normalText}>every day.</span>
              </p>
              <p className='my-1'>
                <span className={cn(normalText, 'pl-0')}>
                  I love the feeling of being a little better than I was yesterday.
                </span>
              </p>
            </section>
            <section data-role='about-me-soft-interest'>
              <p className='my-1'>
                <span className={normalText}>I love</span>
                <span className={highlightText}>traveling</span>
                <span className={normalText}>and spending time in</span>
                <span className={highlightText}>nature</span>
                <span className={normalText}>
                  . Exploring scenic views and diverse cultures feels addictive to me.
                </span>
              </p>
              <p>
                <span className='block'>
                  <span className={normalText}>I also enjoy</span>
                  <span className={highlightText}>taking photos</span>
                  <span className={normalText}>, which helps me preserve those memories.</span>
                </span>
              </p>
            </section>
          </MotionBlurCard>
        </div>

        {/* Tech Stacks */}
        <section
          data-role='about-me-tech'
          className='flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-around'
        >
          <div data-role='about-me-tech-stack' className='mt-10 flex flex-col gap-4 lg:gap-2'>
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
