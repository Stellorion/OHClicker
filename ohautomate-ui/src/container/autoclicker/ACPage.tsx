import React from 'react';
import { useNav } from '../../hooks/useNav';
import { ACMinimizedView } from './views/ACMiniView';
import { ACAdvancedView } from './views/ACAdvView';

export const ACPage: React.FC = () => {
  const { currentMode } = useNav();
  const isAdvanced = currentMode === 'advanced';

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {isAdvanced ? <ACAdvancedView /> : <ACMinimizedView />}
    </div>
  );
};