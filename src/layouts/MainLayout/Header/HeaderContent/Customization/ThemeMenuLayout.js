// material-ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { ThemeDirection, MenuOrientation } from 'config';
import useResponsive from 'hooks/useResponsive';
import useConfig from 'hooks/useConfig';

// assets
import defaultLayout from 'assets/images/customization/default.svg';
import containerLayout from 'assets/images/customization/container.svg';

// ==============================|| CUSTOMIZATION - CONTAINER ||============================== //

const ThemeMenuLayout = () => {
  const theme = useTheme();

  const downLG = useResponsive('down', 'lg');

  const { menuOrientation, onChangeMenuOrientation, onChangeMiniDrawer, onChangeDirection, setIsDrawerOpen } =
    useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const handleContainerChange = (e) => {
    if (e.target.value === MenuOrientation.HORIZONTAL) {
      onChangeMiniDrawer(true);
      onChangeDirection(ThemeDirection.LTR);
      onChangeMenuOrientation(e.target.value);
      setIsDrawerOpen(false);
    } else {
      onChangeMiniDrawer(true);
      onChangeDirection(ThemeDirection.LTR);
      onChangeMenuOrientation(e.target.value);
      setIsDrawerOpen(true);
    }
  };

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={menuOrientation}
      onChange={handleContainerChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        <Grid item>
          <FormControlLabel
            control={<Radio value={MenuOrientation.VERTICAL} sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{ bgcolor: !isHorizontal ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                border={false}
                {...(!isHorizontal && { boxShadow: true, shadow: theme.customShadows.primary })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={defaultLayout}
                    alt="Vertical"
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">Vertical</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Radio value={MenuOrientation.HORIZONTAL} sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{ bgcolor: isHorizontal ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                border={false}
                {...(isHorizontal && { boxShadow: true, shadow: theme.customShadows.primary })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={containerLayout}
                    alt="horizontal"
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">Horizontal</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
      </Grid>
    </RadioGroup>
  );
};

export default ThemeMenuLayout;
