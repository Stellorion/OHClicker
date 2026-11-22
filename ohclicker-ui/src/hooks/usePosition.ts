// Logic for the "Target position" section: mode, coordinates, sequence list, picker.
import { useAC } from "./useAC";
import { usePickState } from "./usePickState";
import { clickerService } from "../services/clickerService";
import type { ChoiceOption } from "../types/common-props";
import type { PositionMode, SequencePoint } from "../types/ac-types";

const POSITION_MODE_OPTIONS: ChoiceOption<PositionMode>[] = [
  { id: "cursor", label: "Cursor" },
  { id: "fixed", label: "Fixed point" },
  { id: "sequence", label: "Sequence" },
];

export const usePosition = () => {
  const { settings, updateSettings } = useAC();
  const { isPicking, pickingPointId, setPicking } = usePickState();
  const sequencePoints = settings.sequencePoints;

  /** Appends a new point at 0,0 (the user then edits or picks it). */
  const addSequencePoint = () => {
    const point: SequencePoint = { id: Date.now().toString(), x: 0, y: 0, dwell: 50 };
    updateSettings({ sequencePoints: [...sequencePoints, point] });
  };

  /** Changes x / y / dwell of one point. */
  const updateSequencePoint = (id: string, fields: Partial<SequencePoint>) => {
    updateSettings({ sequencePoints: sequencePoints.map((p) => (p.id === id ? { ...p, ...fields } : p)) });
  };

  const removeSequencePoint = (id: string) => {
    updateSettings({ sequencePoints: sequencePoints.filter((p) => p.id !== id) });
  };

  /** Arms the picker for the fixed target. */
  const beginPositionPick = async () => {
    await clickerService.beginPositionPick();
    setPicking(true);
  };

  /** Arms the picker for one sequence point. */
  const beginSequencePointPick = async (pointId: string) => {
    await clickerService.beginPositionPick(pointId);
    setPicking(true, pointId);
  };

  return {
    positionMode: settings.positionMode,
    x: settings.targetX,
    y: settings.targetY,
    jitter: settings.jitterPx,
    sequencePoints,
    positionModeOptions: POSITION_MODE_OPTIONS,
    updateSettings,
    addSequencePoint,
    updateSequencePoint,
    removeSequencePoint,
    beginPositionPick,
    beginSequencePointPick,
    isPicking,
    pickingPointId,
  };
};
