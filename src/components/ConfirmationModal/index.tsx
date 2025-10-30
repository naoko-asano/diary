import { Button, Flex, Modal, Text } from "@mantine/core";

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
    <Modal
      opened={isOpened}
      onClose={onClose}
      title={<Text size="xs">{title}</Text>}
      withCloseButton={false}
    >
      <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
        {body}
      </Text>
      <Flex justify="space-around" mt="md">
        <Button size="xs" variant="default" onClick={onClose}>
          <Text size="xs">Cancel</Text>
        </Button>
        <Button
          size="xs"
          color="red"
          onClick={() => {
            onAccept();
            onClose();
          }}
        >
          <Text size="xs">Accept</Text>
        </Button>
      </Flex>
    </Modal>
  );
}
