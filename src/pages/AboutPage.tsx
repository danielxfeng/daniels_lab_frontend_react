import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const AboutPage = () => (
  <main>
    <h1>About Us</h1>
    <img src='/about-pic.jpg' alt='A picture of the website administrator' />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac mauris in libero feugiat
      pulvinar at a nisl. Vestibulum iaculis mi erat, nec lacinia eros aliquam id. Proin nec lorem
      dui. Nulla sagittis augue eu massa ultricies suscipit. Donec vestibulum aliquam quam, maximus
      fringilla lacus sodales vel. Fusce cursus tortor ipsum, nec rutrum nibh sollicitudin sed.
      Suspendisse ac malesuada orci. Integer gravida at ipsum at sodales. Sed urna erat, fermentum
      eget tristique at, dapibus sed enim. Cras ac euismod leo. Quisque tincidunt, orci non blandit
      placerat, quam enim porta tortor, id convallis nulla tortor at lorem. Maecenas at diam
      placerat, tincidunt ligula a, egestas ante. Cras fermentum imperdiet sapien quis aliquam. Nam
      aliquet magna odio, semper gravida nibh sagittis a. Sed id euismod lacus.
    </p>
    <h2>Contact</h2>
    <div>
      <a href='https://github.com/' target='_blank' rel='noopener noreferrer' aria-label='GitHub'>
        <FaGithub />
      </a>

      <a
        href='https://linkedin.com/'
        target='_blank'
        rel='noopener noreferrer'
        aria-label='LinkedIn'
      >
        <FaLinkedin />
      </a>

      <a href='mailto:your@email.com' aria-label='Email'>
        <HiOutlineMail />
      </a>
    </div>
  </main>
);

export default AboutPage;
