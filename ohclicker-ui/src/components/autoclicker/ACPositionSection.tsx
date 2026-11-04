// "Target position" card: cursor / fixed point / sequence, plus jitter.
import { Separator } from "../common/Separator";
import { Target } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { SettingRow } from "../common/SettingRow";
import { usePosition } from "../../hooks/usePosition";
import { ACSequenceList } from "./ACSequenceList";
import { ACFixedCoordinates } from "./ACFixedCoordinates";
import { CARD, SEPARATOR } from "../../lib/styles";

export const ACPositionSection: React.FC = () => {
  const p = usePosition();

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2">
        <Target className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Target position
        </h3>
      </div>

      <Separator className={SEPARATOR} />

      <ChoiceGroup
        label="Position mode"
        options={p.positionModeOptions}
        value={p.positionMode}
        onChange={(val) => p.updateSettings({ positionMode: val })}
      />

      {p.positionMode === "fixed" && (
        <>
          <Separator className={SEPARATOR} />
          <ACFixedCoordinates
            x={p.x}
            y={p.y}
            isPicking={p.isPicking}
            onChange={p.updateSettings}
            onPick={() => void p.beginPositionPick()}
          />
        </>
      )}

      {p.positionMode === "sequence" && (
        <>
          <Separator className={SEPARATOR} />
          <ACSequenceList
            points={p.sequencePoints}
            onUpdatePoint={p.updateSequencePoint}
            onRemovePoint={p.removeSequencePoint}
            onAddPoint={p.addSequencePoint}
            onPickPoint={(id) => void p.beginSequencePointPick(id)}
            pickingPointId={p.pickingPointId}
          />
        </>
      )}

      {p.positionMode !== "cursor" && (
        <>
          <Separator className={SEPARATOR} />
          <SettingRow
            label="Position jitter"
            description="Random pixel offset around each target"
            value={p.jitter}
            unit="px"
            min={0}
            max={50}
            onChange={(val) => p.updateSettings({ jitterPx: val })}
          />
        </>
      )}
    </div>
  );
};
