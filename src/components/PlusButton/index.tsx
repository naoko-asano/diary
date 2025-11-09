"use client";

import { ActionIcon, ActionIconProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface ButtonProps extends ActionIconProps {
  role?: "button";
  onClick: () => void;
}

interface LinkProps extends ActionIconProps {
  role: "link";
  href: string;
}

type Props = ButtonProps | LinkProps;

export function PlusButton(props: Props) {
  const { ...other } = props;

  if (props.role === "link") {
    return (
      <ActionIcon component={Link} href={props.href} radius="100" {...other}>
        <IconPlus />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon onClick={props.onClick} radius="100" {...other}>
      <IconPlus />
    </ActionIcon>
  );
}
