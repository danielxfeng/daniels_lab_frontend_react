import MotionH1 from '@/components/motion_components/MotionH1';
import MotionSpan from '@/components/motion_components/MotionSpan';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import siteMeta from '@/constants/siteMeta';
import rawTechStack from '@/constants/techStack.json';
import { cn } from '@/lib/utils';

const highlightText = 'text-foreground text-xl font-semibold px-1';
const normalText = 'text-muted-foreground italic px-0.5';

const techStack = rawTechStack;

const AboutMe = ({ position }: { position: 'page' | 'div' }) => {
  return (
    <section data-role='about-me-section' className='inner-container my-3'>
      {/* h1 or h2 based on the position */}
      {position === 'div' ? <h2 className='my-6'>About Me</h2> : <MotionH1>About Me</MotionH1>}

      <div data-role='about-me-content' className='flex flex-col gap-6 py-8'>
        {/* Introduction */}
        <section
          data-role='about-me-introduction'
          className='mb-8 flex flex-col items-center gap-6 lg:flex-row'
        >
          <div>
            <Avatar className='ring-offset-background ring-muted z-5 h-24 w-24 shadow-xl ring-2 ring-offset-2'>
              <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
              <AvatarFallback>Daniel</AvatarFallback>{' '}
            </Avatar>
          </div>
          <div className='flex h-24 flex-col justify-between'>
            <span className='text-highlight flex h-1/2 items-center px-2 py-1 text-3xl font-bold text-shadow-md dark:text-blue-500'>
              {siteMeta.me}
            </span>
            <MotionSpan
              text="Let's build something Coooooool !"
              className='text-muted-foreground px-2 py-1 font-semibold italic'
              delay={0.06}
            />
          </div>
        </section>

        {/* Education */}
        <section data-role='about-me-education'>
          <p>
            <span className={cn(highlightText, 'ml-0 pl-0')} aria-hidden={true}>
              Hey there!
            </span>
            <span className={normalText} aria-hidden={true}>
              I’m a
            </span>
            <span className={highlightText} aria-hidden={true}>
              computer science student
            </span>
            <span className={normalText} aria-hidden={true}>
              currently living in
            </span>
            <span className={highlightText} aria-hidden={true}>
              Helsinki
            </span>
            <span className={normalText} aria-hidden={true}>
              with my family.
            </span>
          </p>
          <ul className='ml-8 list-disc'>
            <li>
              <span className={cn(normalText, 'text-foreground mr-1 text-sm')} aria-hidden={true}>
                10.2024 - 12.2025:
              </span>
              <span className={normalText} aria-hidden={true}>
                Studying in
              </span>
              <span className={highlightText} aria-hidden={true}>
                Hive Helsinki
              </span>
            </li>
            <li>
              <span className={cn(normalText, 'text-foreground mr-1 text-sm')} aria-hidden={true}>
                8.2023 - 12.2025:
              </span>
              <span className={normalText} aria-hidden={true}>
                Studying in
              </span>
              <span className={highlightText} aria-hidden={true}>
                HAMK
              </span>
            </li>
          </ul>
          <p className='mt-3 mb-1.5'>
            <span className={cn(normalText, 'ml-0 pl-0')} aria-hidden={true}>
              I'm naturally curious and enjoy learning every day.
            </span>
            <span className={highlightText} aria-hidden={true}>
              curious
            </span>
            <span className={normalText} aria-hidden={true}>
              and enjoy
            </span>
            <span className={highlightText} aria-hidden={true}>
              learning
            </span>
            <span className={normalText} aria-hidden={true}>
              every day.
            </span>
          </p>
          <p className={cn(normalText, 'ml-0 pl-0')}>
            I love the feeling of being a little better than I was yesterday.
          </p>
        </section>

        {/* Work */}
        <section data-role='about-me-work'>
          <p>
            <span className={cn(normalText, 'ml-0 pl-0')} aria-hidden={true}>
              Before August 2023, I worked in
            </span>
            <span className={highlightText} aria-hidden={true}>
              corporate banking
            </span>
            <span className={normalText} aria-hidden={true}>
              in
            </span>
            <span className={highlightText} aria-hidden={true}>
              Shanghai
            </span>
            <span className={normalText} aria-hidden={true}>
              , where I helped businesses manage their liquidity, acquire loans, handle hedging
              strategies, and support M&A transactions.
            </span>
          </p>
          <p>
            <span className={cn(normalText, 'ml-0 pl-0')} aria-hidden={true}>
              This experience helped me build strong
            </span>
            <span className={highlightText} aria-hidden={true}>
              logical thinking
            </span>
            <span className={normalText} aria-hidden={true}>
              for
            </span>
            <span className={highlightText} aria-hidden={true}>
              breaking down
            </span>
            <span className={normalText} aria-hidden={true}>
              complex problems (surprisingly useful when I switched to coding), and the ability to
            </span>
            <span className={highlightText} aria-hidden={true}>
              work in a team
            </span>
            <span className={normalText} aria-hidden={true}>
              .
            </span>
          </p>
        </section>

        {/* Interest */}
        <section data-role='about-me-interest'>
          <p>
            <span className='mb-2 block'>
              <span className={normalText} aria-hidden={true}>
                I love
              </span>
              <span className={highlightText} aria-hidden={true}>
                traveling
              </span>
              <span className={normalText} aria-hidden={true}>
                and spending time in
              </span>
              <span className={highlightText} aria-hidden={true}>
                nature
              </span>
              <span className={normalText} aria-hidden={true}>
                . Exploring scenic views and diverse cultures feels addictive to me.
              </span>
            </span>
            <span className='block'>
              <span className={normalText} aria-hidden={true}>
                I also enjoy
              </span>
              <span className={highlightText} aria-hidden={true}>
                taking photos
              </span>
              <span className={normalText} aria-hidden={true}>
                , which helps me preserve those memories.
              </span>
            </span>
          </p>
        </section>

        {/* Tech Stacks */}
        <section
          data-role='about-me-tech'
          className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-around'
        >
          <div data-role='about-me-tech-stack' className='flex flex-col gap-4 lg:gap-2'>
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
