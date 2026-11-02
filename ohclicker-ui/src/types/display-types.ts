import type { ACDisplay } from './ac-types';

export interface DisplaySelectorProps {
  displays: ACDisplay[];
  selectedDisplay?: ACDisplay;
  onSelect: (id: string) => void;
  onRefresh: () => void;
}