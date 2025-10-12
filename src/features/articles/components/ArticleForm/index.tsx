"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import MDEditor from "@uiw/react-md-editor";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { startTransition, useActionState } from "react";
import rehypeSanitize from "rehype-sanitize";

import { FlashMessageNotifier } from "@/components/FlashMessageNotifier";
import { ArticleParams, articleScheme } from "@/features/articles/model";
import { FormState } from "@/utils/formState";

type Props = {
  onSubmitAction: (
    _prevState: FormState,
    values: ArticleParams,
  ) => Promise<FormState>;
};

export function ArticleForm({ onSubmitAction }: Props) {
  const [formState, formAction, isPending] = useActionState(onSubmitAction, {
    result: null,
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      body: "",
    },
    validate: zod4Resolver(articleScheme),
  });

  return (
    <>
      <FlashMessageNotifier
        formState={formState}
        message="Failed to submit the form. Please try again."
      />
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
    </>
  );
}
