import { Button, Modal, Text } from "@mantine/core";

type Props = {
  isOpened: boolean;
  title?: string;
  body: string;
  onAccept: () => void;
  onClose: () => void;
};

export function ConfirmationModal({
  isOpened,
  title = "確認",
  body,
  onAccept,
  onClose,
}: Props) {
  return (
    <Modal opened={isOpened} onClose={onClose} title={title} centered>
      <Text>{body}</Text>
      <Button
        onClick={() => {
          onAccept();
          onClose();
        }}
      >
        Accept
      </Button>
    </Modal>
  );
}
