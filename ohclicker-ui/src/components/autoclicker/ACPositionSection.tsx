import { Separator } from "../common/Separator";
import { Target, Crosshair } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { usePosition } from "../../hooks/usePosition";
import { SettingRow } from "../common/SettingRow";
import { Button } from "../common/Button";
import { ACSequenceList } from "./ACSequenceList";
import { LabeledInput } from "../common/LabeledInput";

export const ACPositionSection: React.FC = () => {
  const {
    positionMode,
    x,
    y,
    jitter,
    sequencePoints,
    positionModeOptions,
    updateSettings,
    beginPositionPick,
    beginSequencePointPick,
    isPicking,
    pickingPointId,
    addSequencePoint,
    updateSequencePoint,
    removeSequencePoint,
  } = usePosition();

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Target className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Target position
        </h3>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <ChoiceGroup
        label="Position mode"
        options={positionModeOptions}
        value={positionMode}
        onChange={(val) => updateSettings({ positionMode: val })}
      />

      {positionMode === "fixed" && (
        <>
          <Separator className="w-[calc(100%+2rem)] -mx-4" />

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-app-text-primary">
              Coordinates
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <LabeledInput
                  label="X"
                  value={x}
                  widthClass="w-24"
                  onChange={(val) => updateSettings({ targetX: val })}
                />
                <LabeledInput
                  label="Y"
                  value={y}
                  widthClass="w-24"
                  onChange={(val) => updateSettings({ targetY: val })}
                />
              </div>

              <Button
                type="button"
                onClick={() => void beginPositionPick()}
                title="Arm the picker, then click a screen location (F7)"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border/40 border border-app-border rounded-lg text-xs font-bold text-app-text-primary transition-all"
              >
                <Crosshair className="size-3.5 text-app-red" />
                {isPicking ? "Click target" : "Pick"}
              </Button>
            </div>
          </div>
        </>
      )}

      {positionMode === "sequence" && (
        <>
          <Separator className="w-[calc(100%+2rem)] -mx-4" />
          <ACSequenceList
            points={sequencePoints}
            onUpdatePoint={updateSequencePoint}
            onRemovePoint={removeSequencePoint}
            onAddPoint={addSequencePoint}
            onPickPoint={(id) => void beginSequencePointPick(id)}
            pickingPointId={pickingPointId}
          />
        </>
      )}

      {positionMode !== "cursor" && (
        <>
          <Separator className="w-[calc(100%+2rem)] -mx-4" />

          <SettingRow
            label="Position jitter"
            description="Random pixel offset around each target"
            value={jitter}
            unit="px"
            min={0}
            max={50}
            onChange={(val) => updateSettings({ positionJitterPx: val })}
          />
        </>
      )}
    </div>
  );
};