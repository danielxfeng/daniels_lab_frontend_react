import { useRef } from 'react';

import MotionBlurCard from '@/components/motion_components/MotionBlurCard';
import MotionExternalScrollBar from '@/components/motion_components/MotionExtenalScrollBar';
import MotionFadeInParagraph from '@/components/motion_components/MotionFadeinParagraph';
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
  const introductionRef = useRef<HTMLDivElement>(null);

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

      <div
        data-role='about-me-content'
        className='flex w-full flex-col items-center justify-center gap-4 py-8 lg:gap-6'
      >
        {/* Introduction */}
        <section
          data-role='about-me-introduction'
          className='mb-8 flex w-full flex-col items-center justify-start gap-8 lg:flex-row lg:items-start lg:gap-12'
        >
          <div
            data-role='about-me-avatar-container'
            className='flex flex-1 flex-col items-center justify-center gap-8 lg:mt-16'
          >
            <MotionBlurCard
              dataRole='about-me-avatar'
              className='flex flex-1 flex-col items-center justify-center gap-3'
            >
              <Avatar className='ring-offset-background ring-muted z-5 h-32 w-32 shadow-xl ring-2 ring-offset-2 lg:h-40 lg:w-40'>
                <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
                <AvatarFallback>Daniel</AvatarFallback>{' '}
              </Avatar>
              <div
                className='flex justify-between gap-1.5'
                data-role='about-me-avatar-contact-links'
              >
                {contactIconList.map((prop) => (
                  <ContactLink key={prop.supportText} {...prop} />
                ))}
              </div>
            </MotionBlurCard>
            <MotionExternalScrollBar
              syncContainerRef={introductionRef}
              className='hidden lg:flex'
              occupiedHeight={320}
            />
          </div>

          <section
            ref={introductionRef}
            data-role='about-me-introduction-content'
            className='border-border text-foreground/70 [&_strong]:text-foreground relative w-full max-w-prose rounded-2xl border p-6 shadow-md [&_strong]:not-italic'
          >
            <article className='flex flex-col gap-8'>
              <section>
                <MotionFadeInParagraph>
                  <strong className='mb-2 block'>Hey!</strong> I am{' '}
                  <MotionSpan
                    text={siteMeta.me}
                    className='px-2 py-1 text-3xl font-bold'
                    delay={0.09}
                    spanClassNames={new Array(siteMeta.me.length).fill(
                      'bg-gradient-to-br from-[#615fff] to-[#155dfc] bg-clip-text text-transparent drop-shadow-2xl',
                    )}
                  />
                  .
                </MotionFadeInParagraph>
                <MotionFadeInParagraph className='leading-relaxed'>
                  I am currently a <strong>computer science student in Helsinki</strong>, focusing
                  on <strong>full‑stack web development</strong>,{' '}
                  <strong>system programming</strong>, and <strong>AI projects</strong>.
                </MotionFadeInParagraph>
              </section>
              <section>
                <MotionFadeInParagraph className='leading-relaxed'>
                  <strong>In November 2024, I joined Hive Helsinki,</strong> a fully project based
                  program where I’ve been building software mainly in C and C++. One of my favorite
                  projects was a Lightweight POSIX compliant command shell, which was built entirely
                  from scratch, a challenge that taught me to research, design, and debug a
                  low-level robust system on my own. I’ve also met many talented people here, and
                  even collaborated with one of them to create my first real-world project: a
                  Booking Calendar App for school's meeting room booking.
                </MotionFadeInParagraph>
                <MotionFadeInParagraph className='leading-relaxed'>
                  <strong>
                    Earlier, in July 2023, I enrolled in the Computer Applications degree program at
                    HAMK,
                  </strong>{' '}
                  where I learned a broad range of technologies and built this personal website and
                  blog system as part of my thesis project.
                </MotionFadeInParagraph>
                <MotionFadeInParagraph className='leading-relaxed'>
                  <strong>
                    My journey into computer science began even earlier, in February 2023, when I
                    started learning CS theory and programming through online courses.
                  </strong>{' '}
                  I’m so grateful to universities like MIT, Stanford, and UC Berkeley for openly
                  sharing such high quality courses, which gave me access to world class education
                  and built a solid foundation for my transition.
                </MotionFadeInParagraph>
              </section>
              <section>
                <MotionFadeInParagraph className='leading-relaxed'>
                  <strong>
                    Before moving into tech, I worked at a bank in Shanghai until May 2023,
                  </strong>{' '}
                  managing a sales team and collaborating with some of smartest colleagues and
                  clients to structure financial product portfolios for some of the best known
                  companies in China and beyond. Our work supported M&amp;A transactions, helped
                  clients hedge risks, secured financing, and optimized payment and collection
                  processes for better cash flow efficiency.
                </MotionFadeInParagraph>
                <MotionFadeInParagraph className='leading-relaxed'>
                  When I made the switch to tech, I was surprised by how transferable these skills
                  were: the <strong>structured problem‑solving mindset</strong>,{' '}
                  <strong>client‑facing experience</strong>, and <strong>teamwork</strong> I
                  developed in banking have proven just as useful in software development, helping
                  me adapt quickly to this new industry.
                </MotionFadeInParagraph>
              </section>
              <section>
                <MotionFadeInParagraph className='leading-relaxed'>
                  <strong>
                    My innate curiosity and strong ability to learn quickly are what led me to
                    switch careers and move to a new culture,
                  </strong>{' '}
                  and they also fuel my love for exploring the world beyond code. Outside of coding,
                  I love traveling and being in nature with my family, discovering scenic landscapes
                  and diverse cultures whenever I can. I’m also passionate about photography, which
                  lets me capture and preserve the moments and scenery that inspire me.
                </MotionFadeInParagraph>
              </section>
            </article>
          </section>
        </section>

        {/* Tech Stacks */}
        <section
          data-role='about-me-tech'
          className='flex w-full flex-col items-center gap-3 lg:flex-row lg:justify-around'
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
              <iframe
                name='aws-badge'
                src='https://www.credly.com/embedded_badge/97f12050-a9d4-46b3-9754-cb82aacd5a6f'
                title='View my aws certificate on Credly.'
                style={{
                  width: '150px',
                  height: '270px',
                  border: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutMe;
