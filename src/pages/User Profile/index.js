import { useState, useEffect } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Card, MenuItem, Typography, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';

// hooks
import useResponsive from 'hooks/useResponsive';

import { ThemeMode } from 'config';

// context and modules
import fetchAccount from '_apiAxios/account';
import { axiosInstance } from 'utils/axios';
import { useGlobalContext } from 'contexts/AppContext';

// components
import Page from 'components/Page';
import ImageField from 'components/hook-form/ImageField';

// sections
import { PasswordResetForm } from 'sections/auth/password-reset';

import ProfileView from './ProfileView';
import UserProfileUpdate from './ProfileUpdate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  margin: `${theme.spacing(5)} 0px`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[500_12],
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  [theme.breakpoints.up('x4')]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const ProfileHeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[200],
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

// ----------------------------------------------------------------------

export default function Profile() {
  const isMobile = useResponsive('down', 'x4');

  const { profile, setProfile } = useGlobalContext();

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

  const [imageInfo, setImageInfo] = useState(null);

  useEffect(() => {
    if (profile.photoURL) {
      const fileName = profile.photoURL.split('/');

      setImageInfo({
        uid: profile.username,
        name: fileName[fileName?.length - 1],
        status: 'done',
        url: profile.photoURL,
        isCurrentImg: true,
      });
    }
  }, [profile]);

  const onImageChange = (newImage) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    return new Promise((resolve, reject) => {
      axiosInstance
        .patch('users/api/change-profile-image/', { image: newImage }, config)
        .then(() => {
          resolve('submit successful');
          fetchAccount().then(({ userProfile }) => {
            setProfile(userProfile);
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handlePasswordModalOpen = () => {
    setOpenPasswordModal(true);
  };

  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false);
  };

  return (
    <Page title="User Profile View">
      <UserProfileUpdate open={openUpdateProfile} setOpen={setOpenUpdateProfile} />

      <Dialog fullWidth maxWidth="xs" open={openPasswordModal} onClose={handlePasswordModalClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ mb: 2 }} style={{ paddingTop: '10px' }}>
          <PasswordResetForm />
        </DialogContent>
      </Dialog>

      <RootStyle>
        <SectionStyle>
          <ProfileHeaderStyle>
            <Box>
              <AccountStyle>
                <ImageField currentImage={imageInfo} onImageChange={onImageChange} />
                <Box>
                  <Typography variant="h4" sx={{ color: 'text.primary' }}>
                    {profile.displayName}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {profile.role}
                  </Typography>
                </Box>
              </AccountStyle>
            </Box>
            <MenuItem
              onClick={() => {
                setOpenUpdateProfile(true);
              }}
              sx={{ color: '#048eff', border: '1px solid #048eff', borderRadius: 1 }}
            >
              {isMobile ? 'Update' : 'Update Profile'}
            </MenuItem>
          </ProfileHeaderStyle>
          <ProfileView profile={profile} handlePasswordModalOpen={handlePasswordModalOpen} />
        </SectionStyle>
      </RootStyle>
    </Page>
  );
}
