import { useState, useEffect } from 'react';

// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, MenuItem, Box } from '@mui/material';

// hooks
import useResponsive from 'hooks/useResponsive';

import { ThemeMode } from 'config';

// context and modules
import { fetchCompanyInfo } from '_apiAxios/account';
import { axiosInstance } from 'utils/axios';

// components
import Page from 'components/Page';
import CircularLoader from 'components/CircularLoader';
import ImageField from 'components/hook-form/ImageField';

// sections
import CompanyInfoView from './CompanyInfoView';
import UserCompanyInfoUpdate from './CompanyInfoUpdate';

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

const CompanyInfoHeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

export default function CompanyInfo() {
  const theme = useTheme();

  const isMobile = useResponsive('down', 'x3');

  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchCompanyInfo().then(({ companyInfo }) => {
      setCompanyInfo(companyInfo);
      setLoading(false);
    });
  }, [refreshTime]);

  const [openUpdateCompanyInfo, setOpenUpdateCompanyInfo] = useState(false);

  const [imageInfo, setImageInfo] = useState({});

  useEffect(() => {
    if (companyInfo.logo) {
      const fileName = companyInfo.logo.split('/');

      setImageInfo({
        uid: companyInfo.username,
        name: fileName[fileName?.length - 1],
        status: 'done',
        url: companyInfo.logo,
        isCurrentImg: true,
      });
    }
  }, [companyInfo]);

  const onImageChange = (newImage) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    setLoading(true);

    return new Promise((resolve, reject) => {
      axiosInstance
        .patch('users/api/change-company-logo/', { logo: newImage }, config)
        .then(() => {
          resolve('submit successful');
          setRefreshTime(Date.now());
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <Page title="Institute Info View">
      <UserCompanyInfoUpdate
        companyInfo={companyInfo}
        refresh={setRefreshTime}
        open={openUpdateCompanyInfo}
        setOpen={setOpenUpdateCompanyInfo}
      />

      <RootStyle>
        <SectionStyle>
          <CompanyInfoHeaderStyle>
            <Box>
              {loading ? (
                <CircularLoader sectionHeight={100} size={25} />
              ) : (
                <ImageField currentImage={imageInfo} onImageChange={onImageChange} />
              )}
            </Box>

            <MenuItem
              onClick={() => {
                setOpenUpdateCompanyInfo(true);
              }}
              sx={{
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 1,
              }}
            >
              {isMobile ? 'Update' : 'Update Company Info'}
            </MenuItem>
          </CompanyInfoHeaderStyle>

          {loading ? <CircularLoader sectionHeight={200} /> : <CompanyInfoView companyInfo={companyInfo} />}
        </SectionStyle>
      </RootStyle>
    </Page>
  );
}
