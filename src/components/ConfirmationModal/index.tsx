import { Button, Modal, Text } from "@mantine/core";

type Props = {
  isOpened: boolean;
  title?: string;
  body: string;
  onAccept: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  isOpened,
  title = "確認",
  body,
  onAccept,
  onCancel,
}: Props) {
  return (
    <Modal opened={isOpened} onClose={onCancel} title={title} centered>
      <Text>{body}</Text>
      <Button onClick={onAccept}>Accept</Button>
    </Modal>
  );
}
