"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import MDEditor from "@uiw/react-md-editor";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useTransition } from "react";
import rehypeSanitize from "rehype-sanitize";

import { ArticleParams, articleScheme } from "@/features/articles/model";

type Props = {
  onSubmitAction: (values: ArticleParams) => Promise<void>;
};

export function ArticleForm({ onSubmitAction }: Props) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      body: "",
    },
    validate: zod4Resolver(articleScheme),
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        startTransition(() => {
          onSubmitAction(values);
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
