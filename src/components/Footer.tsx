import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';

const Footer = () => (
  <footer>
    <div>&copy; 2025 Blog</div>
    <div>
      Made by ❤️<em>Daniel</em>❤️
    </div>
    <div>
      <a href='https://github.com/' target='_blank' rel='noopener noreferrer'>
        <FaGithub />
      </a>

      <a href='https://linkedin.com/' target='_blank' rel='noopener noreferrer'>
        <FaLinkedin />
      </a>

      <a href='mailto:your@email.com'>
        <HiOutlineMail />
      </a>
    </div>
  </footer>
);

export default Footer;
