import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';

/**
 * @summary A component that displays a share bar with social media links.
 * @param url - The URL to share.
 * @param title - The title of the post.
 * @returns A React component that displays a share bar with social media links.
 */
const ShareBar = ({ url, title }: { url: string; title: string }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  // Copy link to clipboard for Instagram
  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied! You can paste it to Instagram.');
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link.');
    }
  };

  return (
    <div className='flex w-full justify-end' data-role='share-bar'>
      {/* LinkedIn */}
      <MotionButton
        to={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        size='lg'
        variant='secondary'
        icon={<FaLinkedin />}
        supportingText='Share on LinkedIn'
        isExternal={true}
        btnClass='-mr-3'
        dataRole='button-share-linkedin'
      />

      {/* X (Twitter) */}
      <MotionButton
        to={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        size='lg'
        variant='secondary'
        icon={<FaXTwitter />}
        supportingText='Share on X'
        isExternal={true}
        dataRole='button-share-x-twitter'
      />

      {/* Facebook */}
      <MotionButton
        to={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        icon={<FaFacebook />}
        size='lg'
        variant='secondary'
        supportingText='Share on Facebook'
        isExternal={true}
        btnClass='-mr-3'
        dataRole='button-share-facebook'
      />

      {/* Copy link on Instagram */}
      <MotionButton
        buttonType='button'
        size='lg'
        variant='secondary'
        icon={<FaInstagram />}
        onClick={copyLinkToClipboard}
        supportingText='Copy link for Instagram'
        btnClass='-mr-3'
        dataRole='button-copy-link-instagram'
      />
    </div>
  );
};

export default ShareBar;
