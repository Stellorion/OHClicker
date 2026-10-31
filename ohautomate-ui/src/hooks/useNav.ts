import { useUIStore } from '../store/useUIStore';

export const useNav = () => {
  const activeTab = useUIStore((state) => state.activeTab);
  const clickerMode = useUIStore((state) => state.clickerMode);
  const macroMode = useUIStore((state) => state.macroMode);
  const settingsMode = useUIStore((state) => state.settingsMode);
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const setPageMode = useUIStore((state) => state.setPageMode);
  const togglePageMode = useUIStore((state) => state.togglePageMode);

  const currentMode =
    activeTab === 'clicker'
      ? clickerMode
      : activeTab === 'macro'
      ? macroMode
      : settingsMode;

  return {
    activeTab,
    currentMode,
    setActiveTab,
    setPageMode,
    togglePageMode,
  };
};