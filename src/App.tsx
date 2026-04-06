import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { DeparturesCard } from './components/DeparturesCard';
import { VestlBoard } from './components/VestlBoard';
import { SignalLayout } from './components/SignalLayout';
import { BvgLayout } from './components/BvgLayout';
import { NovaLayout } from './components/NovaLayout';
import { PaperLayout } from './components/PaperLayout';
import { MetroLayout } from './components/MetroLayout';
import { SbahnLayout } from './components/SbahnLayout';
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

  if (customization.layout === 'bvg' || customization.layout === 'bvg-green' || customization.layout === 'bvg-large' || customization.layout === 'bvg-clean') {
    const variantMap: Record<string, 'amber' | 'green' | 'large' | 'clean'> = {
      'bvg': 'amber', 'bvg-green': 'green', 'bvg-large': 'large', 'bvg-clean': 'clean',
    };
    return (
      <>
        <BvgLayout
          theme={currentTheme}
          weatherState={weatherState}
          departuresState={departuresState}
          hiddenModes={userConfig.hiddenModes}
          variant={variantMap[customization.layout]}
        />
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

  if (customization.layout === 'sbahn') {
    return (<><SbahnLayout theme={currentTheme} weatherState={weatherState} departuresState={departuresState} hiddenModes={userConfig.hiddenModes} /><ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} customization={customization} onCustomizationChange={setCustomization} userConfig={userConfig} onSaveConfig={handleSaveConfig} /></>);
  }
  if (customization.layout === 'nova') {
    return (<><NovaLayout theme={currentTheme} weatherState={weatherState} departuresState={departuresState} hiddenModes={userConfig.hiddenModes} /><ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} customization={customization} onCustomizationChange={setCustomization} userConfig={userConfig} onSaveConfig={handleSaveConfig} /></>);
  }
  if (customization.layout === 'paper') {
    return (<><PaperLayout theme={currentTheme} weatherState={weatherState} departuresState={departuresState} hiddenModes={userConfig.hiddenModes} /><ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} customization={customization} onCustomizationChange={setCustomization} userConfig={userConfig} onSaveConfig={handleSaveConfig} /></>);
  }
  if (customization.layout === 'metro') {
    return (<><MetroLayout theme={currentTheme} weatherState={weatherState} departuresState={departuresState} hiddenModes={userConfig.hiddenModes} /><ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} customization={customization} onCustomizationChange={setCustomization} userConfig={userConfig} onSaveConfig={handleSaveConfig} /></>);
  }
  if (customization.layout === 'signal') {
    return (
      <>
        <SignalLayout
          theme={currentTheme}
          weatherState={weatherState}
          departuresState={departuresState}
          hiddenModes={userConfig.hiddenModes}
        />
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

  return (
    <>
      <Layout theme={currentTheme} weatherState={weatherState} customization={customization}>
        {customization.layout === 'wide'
          ? <VestlBoard departuresState={departuresState} theme={currentTheme} hiddenModes={userConfig.hiddenModes} />
          : <DeparturesCard departuresState={departuresState} theme={currentTheme} hiddenModes={userConfig.hiddenModes} />
        }
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
