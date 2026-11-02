import React from 'react';
import { ACHeader } from '../components/autoclicker/ACHeader';
import { ACTimingSection } from '../components/autoclicker/ACTimingSection';
import { ACClickSection } from '../components/autoclicker/ACClickSection';
import { ACPositionSection } from '../components/autoclicker/ACPositionSection';
import { ACLimitsSection } from '../components/autoclicker/ACLimitsSection';
import { ACBoundariesSection } from '../components/autoclicker/ACBoundariesSection';
import { ACHotkeysSection } from '../components/autoclicker/ACHotkeysSection';
import { ACScreenMapWidget } from '../components/autoclicker/screen-map/ACScreenMapWidget';
import { ACEstimateWidget } from '../components/autoclicker/ACEstimateWidget';

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