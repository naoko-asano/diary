import { Button, ButtonProps, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

interface Props extends ButtonProps {
  href: string;
}

export function BackButton(props: Props) {
  const { href, ...other } = props;

  return (
    <Button
      component={Link}
      href={href}
      variant="outline"
      leftSection={<IconChevronLeft size="24" />}
      {...other}
    >
      <Text size={other.size ?? "sm"}>Back</Text>
    </Button>
  );
}
