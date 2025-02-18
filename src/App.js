// routes
import Router from 'routes';

// theme
import ThemeProvider from 'theme';
import ThemeCustomization from 'themes';

// components
import ScrollToTop from 'components/ScrollToTop';
import { BaseOptionChartStyle } from 'components/chart/BaseOptionChart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeCustomization>
  );
}
