import { ActionIcon, ActionIconProps } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface TrashButtonProps extends ActionIconProps {
  onClick: () => void;
}

export function TrashButton(props: TrashButtonProps) {
  const { onClick, ...other } = props;
  return (
    <ActionIcon onClick={onClick} variant="transparent" {...other}>
      <IconTrash />
    </ActionIcon>
  );
}
