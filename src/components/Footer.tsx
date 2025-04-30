import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';

const Footer = () => (
  <footer>
    <div>&copy; 2025 Blog</div>
    <div>
      Made by ❤️<em>Daniel</em>❤️
    </div>
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
  </footer>
);

export default Footer;
