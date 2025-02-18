import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

// project import
import config from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
  ...config,
  onChangeContainer: () => {},
  onChangeLocalization: () => {},
  onChangeMode: () => {},
  onChangePresetColor: () => {},
  onChangeDirection: () => {},
  onChangeMiniDrawer: () => {},
  onChangeMenuOrientation: () => {},
  onChangeFontFamily: () => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

export const ConfigContext = createContext(initialState);

export default function ConfigProvider({ children }) {
  const [config, setConfig] = useLocalStorage('ifrs-9-config', initialState);

  const onChangeContainer = () => {
    setConfig({
      ...config,
      container: !config.container,
    });
  };

  const onChangeLocalization = (lang) => {
    setConfig({
      ...config,
      i18n: lang,
    });
  };

  const onChangeMode = (mode) => {
    setConfig({
      ...config,
      mode,
    });
  };

  const onChangePresetColor = (theme) => {
    setConfig({
      ...config,
      presetColor: theme,
    });
  };

  const onChangeDirection = (direction) => {
    setConfig({
      ...config,
      themeDirection: direction,
    });
  };

  const onChangeMiniDrawer = (miniDrawer) => {
    setConfig({
      ...config,
      miniDrawer,
    });
  };

  const onChangeMenuOrientation = (layout) => {
    setConfig({
      ...config,
      menuOrientation: layout,
    });
  };

  const onChangeFontFamily = (fontFamily) => {
    setConfig({
      ...config,
      fontFamily,
    });
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNavID, setSelectedNavID] = useState(null);
  const [openNavItem, setOpenNavItem] = useState([]);

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeMenuOrientation,
        onChangeFontFamily,
        isDrawerOpen,
        setIsDrawerOpen,
        openNavItem,
        setOpenNavItem,
        selectedNavID,
        setSelectedNavID,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = {
  children: PropTypes.node,
};
