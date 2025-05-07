import { FaXTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa6';
import { toast } from 'sonner';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import MotionIconButton from '../motion_components/MotionIconButton';

const className='w-6 h-6';

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
    <div className='flex w-full justify-end gap-3'>
      {/* LinkedIn */}
      <MotionIconLink
        to={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        icon={<FaLinkedin className={className} />}
        ariaLabel='Share on LinkedIn'
        isExternal={true}
        tooltip='Share on LinkedIn'
      />

      {/* X (Twitter) */}
      <MotionIconLink
        to={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        icon={<FaXTwitter className={className} />}
        ariaLabel='Share on X'
        isExternal={true}
        tooltip='Share on X'
      />

      {/* Facebook */}
      <MotionIconLink
        to={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        icon={<FaFacebook className={className}/>}
        ariaLabel='Share on Facebook'
        isExternal={true}
        tooltip='Share on Facebook'
      />

      {/* Copy link on Instagram */}
      <MotionIconButton
        icon={<FaInstagram className={className}/>}
        onClick={copyLinkToClipboard}
        ariaLabel='Copy link for Instagram'
        type='button'
        tooltip='Copy link for Instagram'
        
      />
    </div>
  );
};

export default ShareBar;
