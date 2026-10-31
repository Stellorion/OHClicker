import React from 'react';
import { ACHeader } from '../components/ACHeader';
import { ACTimingSection } from '../components/ACTimingSection';
import { ACClickSection } from '../components/ACClickSection';
import { ACPositionSection } from '../components/ACPositionSection';
import { ACLimitsSection } from '../components/ACLimitsSection';
import { ACBoundariesSection } from '../components/ACBoundariesSection';
import { ACHotkeysSection } from '../components/ACHotkeysSection';
import { ACScreenMapWidget } from '../components/screen-map/ACScreenMapWidget';
import { ACEstimateWidget } from '../components/ACEstimateWidget';

export const ACAdvancedView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <ACTimingSection />
        <ACClickSection />
        <ACPositionSection />
        <ACLimitsSection />
        <ACBoundariesSection />
      </div>

      <div className="lg:col-span-1 space-y-6">
        <ACHeader />
        <ACScreenMapWidget />
        <ACEstimateWidget />
        <ACHotkeysSection />
      </div>
    </div>
  );
};