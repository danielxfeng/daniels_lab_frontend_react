import { useState } from 'react';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';
import logError from '@/lib/logError';
import { OAuthConsentQuery, OAuthRedirectResponseSchema } from '@/schema/schema_auth';
import { OauthProvider, OauthProviderValues } from '@/schema/schema_components';
import { UserResponse } from '@/schema/schema_users';
import { oauthLinkUser, oauthUnlinkUser } from '@/services/service_auth';
import useUserStore from '@/stores/useUserStore';

const oauthMap = {
  google: <FaGoogle />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// List of OAuth providers
const UserOauthLinkBar = ({
  user,
  deviceId,
}: {
  user: Partial<UserResponse>;
  deviceId: string;
}) => {
  const [currentLoadingProvider, setCurrentLoadingProvider] = useState<OauthProvider | null>(null);
  const setUser = useUserStore.getState().setUser;
  let redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/user';
  if (redirectTo === '/user/login') redirectTo = '/user';

  const handleUnlinkClick = async (provider: OauthProvider) => {
    setCurrentLoadingProvider(provider);
    try {
      await oauthUnlinkUser(provider);
      toast.success(`Cool! ${provider} has been un-linked successfully.`);
      setUser({
        ...user,
        oauthProviders: user.oauthProviders?.filter((p) => p !== provider) as OauthProvider[],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logError(error, `Failed to unlink ${provider}`);
      const errMsg =
        error.response?.status === 422 ? ' : Cannot unlink the last provider.' : 'undefined';
      toast.error(`Failed to unlink ${provider} ${errMsg}`);
    } finally {
      setCurrentLoadingProvider(null);
    }
  };

  const handleLinkClick = async (provider: OauthProvider) => {
    setCurrentLoadingProvider(provider);
    try {
      const body: OAuthConsentQuery = {
        deviceId,
        redirectTo,
        consentAt: new Date().toISOString(),
      };
      const res = await oauthLinkUser(provider, body);
      const validatedRes = OAuthRedirectResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        logError(validatedRes.error, `Failed to link ${provider}: Invalid response data`);
        return toast.error(`Failed to link ${provider}, please try again later.`);
      }
      // Redirect to the OAuth provider's page
      window.location.href = validatedRes.data.redirectUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logError(error, `Failed to link ${provider}`);
      toast.error(`Failed to link ${provider}`);
    } finally {
      setCurrentLoadingProvider(null);
    }
  };

  return (
    <div className='flex w-full flex-col items-center gap-4' data-role='user-oauth-link-bar'>
      <h3>Manage linked accounts</h3>
      <div className='lg: flex w-full max-w-md flex-col gap-5' data-role='oauth-link-buttons'>
        {OauthProviderValues.map((provider) => {
          const isLinked = user.oauthProviders?.includes(provider);
          return (
            <div key={provider} className='flex w-full items-center'>
              {isLinked ? (
                <MotionButton
                  buttonType='button'
                  variant='highlight'
                  size='md'
                  icon={oauthMap[provider]}
                  text={`Unlink ${capitalizeFirstLetter(provider)}`}
                  onClick={() => handleUnlinkClick(provider)}
                  isDisabled={currentLoadingProvider === provider}
                  supportingText={`Unlink ${provider}`}
                  isFullWidth={true}
                  dataRole={`button-unlink-${provider}`}
                />
              ) : (
                <MotionButton
                  buttonType='button'
                  variant='ghost'
                  size='md'
                  icon={oauthMap[provider]}
                  text={`Link ${capitalizeFirstLetter(provider)}`}
                  onClick={() => handleLinkClick(provider)}
                  isDisabled={currentLoadingProvider === provider}
                  supportingText={`Link ${provider}`}
                  isFullWidth={true}
                  dataRole={`button-link-${provider}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOauthLinkBar;
