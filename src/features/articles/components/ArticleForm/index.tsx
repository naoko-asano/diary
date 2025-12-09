"use client";

import {
  Box,
  Button,
  FileInput,
  NativeSelect,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import MDEditor from "@uiw/react-md-editor";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { startTransition, useActionState, useState } from "react";
import rehypeSanitize from "rehype-sanitize";

import { BackButton } from "@/components/BackButton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FlashMessageNotifier } from "@/components/FlashMessageNotifier";
import {
  Article,
  ArticleParams,
  articleScheme,
  Status,
} from "@/features/articles/model";
import { FormState } from "@/utils/formState";
import { uploadImage } from "@/utils/image";

import "./styles.css";

type Props = {
  article?: Article;
  onSubmitAction: (
    _prevState: FormState,
    values: ArticleParams,
  ) => Promise<FormState>;
};

const statusOptions = [
  { value: Status.DRAFT, label: "Draft" },
  { value: Status.PUBLISHED, label: "Publish" },
];

export function ArticleForm(props: Props) {
  const { article, onSubmitAction } = props;
  const [formState, formAction, isPending] = useActionState(onSubmitAction, {
    result: null,
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: article?.title ?? "",
      body: article?.body ?? "",
      featuredImageUrl: article?.featuredImageUrl ?? null,
      date: article?.date ?? new Date(),
      status: article?.status ?? Status.DRAFT,
    },
    validate: zod4Resolver(articleScheme),
    transformValues: (values) => ({
      ...values,
      date: new Date(values.date),
    }),
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = !(uploading || isPending);

  return (
    <>
      <FlashMessageNotifier
        formState={formState}
        message={"Failed to submit the form.\nPlease try again later."}
      />
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!canSubmit) return;
          if (featuredImage) {
            setUploading(true);
            values.featuredImageUrl = (await uploadImage(featuredImage)).url;
            setUploading(false);
          }
          startTransition(() => {
            formAction(values);
          });
        })}
      >
        <NativeSelect
          label="Status"
          data={statusOptions}
          {...form.getInputProps("status")}
        />
        <DatePickerInput
          label="Date"
          key={form.key("date")}
          {...form.getInputProps("date")}
          required
          firstDayOfWeek={0}
          valueFormat="YYYY/MM/DD"
          styles={{
            calendarHeaderLevel: {
              fontSize: "var(--mantine-font-size-xs)",
            },
            weekday: { fontSize: "var(--mantine-font-size-xs)" },
          }}
        />
        <FileInput
          label="Featured Image"
          value={featuredImage}
          onChange={setFeaturedImage}
        />
        <TextInput
          label="Title"
          key={form.key("title")}
          {...form.getInputProps("title")}
          required
        />
        <Text size="sm" my={6}>
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
        <ErrorMessage size="xs" mt={4}>
          {form.errors.body}
        </ErrorMessage>
        <Box
          mt="var(--mantine-spacing-sm)"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <BackButton
            href="/admin/articles"
            mr="sm"
            aria-label="Back to Article List"
          />
          <Button type="submit" loading={!canSubmit}>
            <Text size="sm">Submit</Text>
          </Button>
        </Box>
      </form>
    </>
  );
}
