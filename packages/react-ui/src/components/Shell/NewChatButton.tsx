import { useThreadList } from "@openuidev/react-headless";
import clsx from "clsx";
import { SquarePen } from "lucide-react";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { useShellStore } from "../_shared/store";
import { useOptionalSidebarVisualState } from "./Sidebar";

export const NewChatButton = ({ className }: { className?: string }) => {
  const switchToNewThread = useThreadList((s) => s.switchToNewThread);
  const { isSidebarOpen } = useShellStore((state) => ({
    isSidebarOpen: state.isSidebarOpen,
  }));
  const sidebarVisualState = useOptionalSidebarVisualState();
  const showExpandedButton = sidebarVisualState
    ? sidebarVisualState.visualState === "expanded"
    : isSidebarOpen;

  if (!showExpandedButton) {
    return (
      <IconButton
        icon={<SquarePen size="1em" />}
        onClick={switchToNewThread}
        variant="secondary"
        size="small"
        className={clsx("openui-shell-new-chat-button_collapsed", className)}
      />
    );
  }

  return (
    <Button
      className={clsx("openui-shell-new-chat-button", className)}
      iconLeft={<SquarePen />}
      variant="secondary"
      size="small"
      onClick={switchToNewThread}
    >
      New Chat
    </Button>
  );
};
