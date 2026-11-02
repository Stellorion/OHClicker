import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { ACMinimizedView } from './ACMiniView';
import { ACAdvancedView } from './ACAdvView';

export const ACPage: React.FC = () => {
  const currentMode = useUIStore((state) => state.clickerMode);
  const isAdvanced = currentMode === 'advanced';

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {isAdvanced ? <ACAdvancedView /> : <ACMinimizedView />}
    </div>
  );
};