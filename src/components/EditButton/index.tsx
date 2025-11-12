import { ActionIcon, ActionIconProps } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";

interface Props extends ActionIconProps {
  href: string;
}

export function EditButton(props: Props) {
  const { href, ...other } = props;
  return (
    <ActionIcon
      component={Link}
      href={href}
      variant="transparent"
      color="var(--mantine-color-text)"
      {...other}
    >
      <IconEdit />
    </ActionIcon>
  );
}
