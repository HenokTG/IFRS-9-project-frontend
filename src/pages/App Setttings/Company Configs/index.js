import { useState, useEffect } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Box,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  Popover,
  Chip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { MdEditNote } from 'react-icons/md';

// hooks
import useResponsive from 'hooks/useResponsive';

import { ThemeMode } from 'config';

// components
import Page from 'components/Page';

// context and modules
import { fetchCompanyConfigs } from '_apiAxios/account';
import { axiosInstance } from 'utils/axios';
import { useGlobalContext } from 'contexts/AppContext';

// sections
import ListLoading from 'utils/helper-modules/listLoading';
import LoanSectorConfigForm from './LoanSectorConfigForm';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'column',
    marginInline: theme.spacing(5),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(5),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[500_12],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 1.5),
  },
}));

const AccordionContainer = styled(Accordion)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(0, 2.5),
}));

const GroupHeader = styled(AccordionSummary)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0, 2.5),
  fontWeight: 500,
  backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[400],
}));

const GroupDetailStyle = styled(AccordionDetails)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

const GroupItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingBottom: 8,
  paddingInline: 16,
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
  [theme.breakpoints.down('sm')]: {
    paddingInline: 4,
  },
}));

// ----------------------------------------------------------------------

export default function CompanyConfigs() {
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(null);
  const [companyConfigs, setCompanyConfigs] = useState({});

  const [loanSectorConfigs, setLoanSectorConfigs] = useState({});
  const [openLoanSectorForm, setOpenLoanSectorForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCompanyConfigs().then(({ configurations }) => {
      setCompanyConfigs(configurations);
      setLoading(false);
    });
  }, [refreshTime]);

  const handleDelete = async (ls) => {
    const deleteLoanSector = {
      key: ls.key,
      label: ls.label,
      delete_key: ls.key,
      description: ls.description,
    };

    axiosInstance
      .patch('users/api/update-institute-configs/', deleteLoanSector, null)
      .then(() => {
        setRefreshTime(Date.now());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'confirm-delete-loan-sector' : undefined;

  return (
    <Page title="Institute Analysis Configuratoins">
      <LoanSectorConfigForm
        loanSectorConfigs={loanSectorConfigs}
        refresh={setRefreshTime}
        open={openLoanSectorForm}
        setOpen={setOpenLoanSectorForm}
      />
      <RootStyle>
        <Stack direction="row" alignItems="center" mb={2}>
          <Typography variant="h4" gutterBottom>
            Analaysis Configuratoins
          </Typography>
        </Stack>
        <SectionStyle>
          {loading ? (
            <ListLoading />
          ) : (
            <>
              {Object.entries(companyConfigs).map(([group, groupItems]) => {
                const groupTitle = group
                  .split('_')
                  .map((grStr) => grStr[0].toUpperCase() + grStr.slice(1))
                  .join(' ');
                return (
                  <AccordionContainer key={group} defaultExpanded={group === 'loan_sector'}>
                    <GroupHeader
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${group}-content`}
                      id={`${group}-header`}
                    >
                      {groupTitle}
                    </GroupHeader>
                    <GroupDetailStyle>
                      {groupItems.map((item, idx) => (
                        <GroupItemStyle key={groupTitle + idx}>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(8, 1fr)',
                              gap: '10px',
                            }}
                          >
                            <Box sx={{ gridColumn: { xs: '1/8', sm: '1 / 3' }, display: 'flex', gap: 1 }}>
                              Code:
                              <Chip size="small" label={item.key} sx={{ px: 2, borderRadius: 1 }} />
                            </Box>
                            <Box sx={{ gridColumn: { xs: '1/8', sm: '3 / 8' }, display: 'flex', gap: 1 }}>
                              Label:
                              <Typography variant="p" sx={{ fontWeight: 500 }} gutterBottom>
                                {item.label}
                              </Typography>
                            </Box>
                            {group === 'loan_sector' && (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  onClick={() => {
                                    setOpenLoanSectorForm(true);
                                    setLoanSectorConfigs(item);
                                  }}
                                  color="warning"
                                  sx={{ pl: 1, pr: 0, minWidth: 0 }}
                                >
                                  <MdEditNote color="goldenrod" size={32} />
                                </Button>
                                <Button
                                  aria-describedby={id}
                                  color="error"
                                  size="small"
                                  sx={{ px: 1, minWidth: 0 }}
                                  gutt
                                >
                                  <DeleteForeverIcon onClick={handleClick} color="red" size={32} />
                                </Button>
                                <Popover
                                  id={id}
                                  open={open}
                                  onClose={handleClose}
                                  anchorEl={anchorEl}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                  }}
                                >
                                  <Typography
                                    sx={{ p: 1 }}
                                    onClick={() => {
                                      handleDelete(item);
                                      handleClose();
                                    }}
                                  >
                                    <Button size="small" variant="contained" color="error">
                                      Delete Loan Sector?
                                    </Button>
                                  </Typography>
                                </Popover>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            Description:
                            <Typography variant="p">{item.description}</Typography>
                          </Box>
                        </GroupItemStyle>
                      ))}
                    </GroupDetailStyle>
                    {group === 'loan_sector' && (
                      <AccordionActions>
                        <Button
                          onClick={() => {
                            setOpenLoanSectorForm(true);
                            setLoanSectorConfigs({});
                          }}
                          variant="outlined"
                          sx={{ px: 4, mb: 2 }}
                        >
                          Add Sector
                        </Button>
                      </AccordionActions>
                    )}
                  </AccordionContainer>
                );
              })}
            </>
          )}
        </SectionStyle>
      </RootStyle>
    </Page>
  );
}
