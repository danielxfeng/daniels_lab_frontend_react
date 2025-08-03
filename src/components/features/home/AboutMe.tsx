import MotionBlurCard from '@/components/motion_components/MotionBlurCard';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionSpan from '@/components/motion_components/MotionSpan';
import ContactLink from '@/components/shared/ContactLink';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
      {position === 'div' ? (
        <h2 className='text-gradient my-6'>About Me</h2>
      ) : (
        <MotionH1>About Me</MotionH1>
      )}

      <div data-role='about-me-content' className='flex w-full flex-col items-center gap-6 py-8'>
        {/* Introduction */}
        <section
          data-role='about-me-introduction'
          className='mb-8 flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-12'
        >
          <MotionBlurCard
            dataRole='about-me-avatar'
            className='flex flex-col items-center justify-center gap-3 lg:w-2/5'
          >
            <Avatar className='ring-offset-background ring-muted z-5 h-32 w-32 shadow-xl ring-2 ring-offset-2 lg:h-40 lg:w-40'>
              <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
              <AvatarFallback>Daniel</AvatarFallback>{' '}
            </Avatar>
            <div className='flex justify-between gap-1.5' data-role='about-me-avatar-contact-links'>
              {contactIconList.map((prop) => (
                <ContactLink key={prop.supportText} {...prop} />
              ))}
            </div>
          </MotionBlurCard>

          <MotionBlurCard
            dataRole='about-me-introduction-content'
            className='border-border text-foreground/65 [&_strong]:text-foreground relative w-full rounded-2xl border bg-white p-6 italic shadow-md lg:w-2/3 dark:bg-neutral-950 [&_strong]:not-italic'
          >
            <p>
              <strong className='mb-2 block'>Hey!</strong> I am{' '}
              <MotionSpan
                text={siteMeta.me}
                className='px-2 py-1 text-3xl font-bold'
                delay={0.09}
                spanClassNames={new Array(siteMeta.me.length).fill(
                  'bg-gradient-to-br from-[#615fff] to-[#155dfc] bg-clip-text text-transparent drop-shadow-2xl',
                )}
              />
            </p>
            <p>
              <strong>CS student · Helsinki</strong>
            </p>
            <p>
              I focus on full stack <strong>web development</strong>, and also enjoy{' '}
              <strong>system programming</strong> and building <strong>AI</strong> toys.
            </p>
          </MotionBlurCard>
        </section>

        {/* Tech Stacks */}
        <section
          data-role='about-me-tech'
          className='flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-around'
        >
          <div data-role='about-me-tech-stack' className='mt-10 flex flex-col gap-4 lg:gap-2'>
            <h4 className='mb-4 flex items-center justify-start gap-1.5'>
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
                    <Badge
                      key={value}
                      variant='default'
                      className='bg-gradient rounded-full text-neutral-100'
                    >
                      {value}
                    </Badge>
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
