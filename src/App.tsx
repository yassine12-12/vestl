import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { DeparturesCard } from './components/DeparturesCard';
import { ThemeSelector } from './components/ThemeSelector';
import { useWeather } from './hooks/useWeather';
import { useDepartures } from './hooks/useDepartures';
import { themes, Theme, getTheme } from './themes';
import { ThemeCustomization, DEFAULT_CUSTOMIZATION } from './types';
import { UserConfig, getUserConfig, saveUserConfig } from './userConfig';
import { config as defaultConfig } from './config';

function App() {
  const [userConfig, setUserConfig] = useState<UserConfig>(() => {
    const saved = getUserConfig();
    return saved ?? { address: defaultConfig.MY_ADDRESS, lat: defaultConfig.MY_LAT, lon: defaultConfig.MY_LON, hiddenModes: [] };
  });

  const weatherState = useWeather(userConfig.lat, userConfig.lon);
  const departuresState = useDepartures(userConfig.lat, userConfig.lon);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('dashboardTheme');
    return saved ? getTheme(saved) : themes[0];
  });

  const [customization, setCustomization] = useState<ThemeCustomization>(() => {
    const saved = localStorage.getItem('dashboardCustomization');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMIZATION;
  });

  useEffect(() => {
    localStorage.setItem('dashboardTheme', currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('dashboardCustomization', JSON.stringify(customization));
  }, [customization]);

  const handleSaveConfig = useCallback((cfg: UserConfig) => {
    saveUserConfig(cfg);
    setUserConfig(cfg);
  }, []);

  return (
    <>
      <Layout theme={currentTheme} weatherState={weatherState} customization={customization}>
        <DeparturesCard departuresState={departuresState} theme={currentTheme} hiddenModes={userConfig.hiddenModes} />
      </Layout>
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        customization={customization}
        onCustomizationChange={setCustomization}
        userConfig={userConfig}
        onSaveConfig={handleSaveConfig}
      />
    </>
  );
}

export default App;
