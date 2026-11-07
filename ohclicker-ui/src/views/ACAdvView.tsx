// Advanced layout: settings on the left, header / map / hotkeys / options on the right.
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
import { ACOptionsSection } from '../components/autoclicker/options/ACOptionsSection';

export const ACAdvancedView: React.FC = () => {
  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 gap-6 items-stretch">
      <div className="lg:col-span-3 space-y-6">
        <ACTimingSection />
        <ACClickSection />
        <ACPositionSection />
        <ACLimitsSection />
        <ACBoundariesSection />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <ACHeader />
        <ACScreenMapWidget />
        <ACEstimateWidget />
        <ACHotkeysSection />
        <ACOptionsSection />
      </div>
    </div>
  );
};