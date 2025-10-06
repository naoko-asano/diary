"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import MDEditor from "@uiw/react-md-editor";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { startTransition, useActionState, useEffect } from "react";
import rehypeSanitize from "rehype-sanitize";

import { ArticleParams, articleScheme } from "@/features/articles/model";

type FormState = {
  hasError: boolean;
} | null;

type Props = {
  onSubmitAction: (
    _prevState: FormState,
    values: ArticleParams,
  ) => Promise<FormState>;
};

const xIcon = <IconX size={20} />;

export function ArticleForm({ onSubmitAction }: Props) {
  const [formState, formAction, isPending] = useActionState(
    onSubmitAction,
    null,
  );
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      body: "",
    },
    validate: zod4Resolver(articleScheme),
  });

  useEffect(() => {
    if (formState?.hasError) {
      notifications.show({
        icon: xIcon,
        title: <Text size="xs">Error has occurred</Text>,
        message: (
          <Text size="xs">Failed to submit the form. Please try again.</Text>
        ),
        color: "red",
      });
    }
  }, [formState]);

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        startTransition(() => {
          formAction(values);
        });
      })}
    >
      <TextInput
        label="Title"
        key={form.key("title")}
        {...form.getInputProps("title")}
        required
      />
      <Text size={"sm"} my={6}>
        Body
      </Text>
      <div data-theme="custom-dark">
        <MDEditor
          value={form.values.body}
          onChange={(value) => form.setFieldValue("body", value ?? "")}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          data-testid="body-editor"
        />
        <Text c={"error"} size={"xs"} mt={4}>
          {form.errors.body}
        </Text>
      </div>
      <Button type="submit" loading={isPending}>
        Submit
      </Button>
    </form>
  );
}
