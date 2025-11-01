"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import MDEditor from "@uiw/react-md-editor";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { startTransition, useActionState } from "react";
import rehypeSanitize from "rehype-sanitize";

import { FlashMessageNotifier } from "@/components/FlashMessageNotifier";
import {
  Article,
  ArticleParams,
  articleScheme,
} from "@/features/articles/model";
import { FormState } from "@/utils/formState";

import "./styles.css";

type Props = {
  article?: Article;
  onSubmitAction: (
    _prevState: FormState,
    values: ArticleParams,
  ) => Promise<FormState>;
};

export function ArticleForm({ article, onSubmitAction }: Props) {
  const [formState, formAction, isPending] = useActionState(onSubmitAction, {
    result: null,
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: article?.title ?? "",
      body: article?.body ?? "",
    },
    validate: zod4Resolver(articleScheme),
  });

  return (
    <>
      <FlashMessageNotifier
        formState={formState}
        message={"Failed to submit the form.\nPlease try again later."}
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
        <Button type="submit" loading={isPending}>
          Submit
        </Button>
      </form>
    </>
  );
}
