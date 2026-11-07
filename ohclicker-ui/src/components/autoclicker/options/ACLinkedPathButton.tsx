// Shows the full path of the linked profile; clicking it opens the file's folder.
import { Button } from "../../common/Button";

interface ACLinkedPathButtonProps {
  path: string;
  onReveal: () => void;
}

export const ACLinkedPathButton: React.FC<ACLinkedPathButtonProps> = ({
  path,
  onReveal,
}) => (
  <Button
    onClick={onReveal}
    title={`${path}\n(click to show in folder)`}
    className="mt-2 flex w-full min-w-0 justify-start items-center rounded-lg border border-app-border bg-app-bg px-3.5 py-3 text-left transition-colors hover:border-app-text-muted"
  >
    <span className="truncate font-mono text-sm text-app-text-muted">
      {path}
    </span>
  </Button>
);
