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
import {
  ActionResult,
  ActionResultStatuses,
} from "@/features/actionResult/model";
import {
  Article,
  ArticleParams,
  articleScheme,
  STATUSES as ArticleStatuses,
} from "@/features/articles/model";
import { useFlashMessage } from "@/features/flashMessage/hooks/useFlashMessage";
import { uploadImage } from "@/utils/image";
import { toSentenceCase } from "@/utils/string";

import "./styles.css";

interface Props {
  article?: Article;
  submitAction: (
    _prevResult: ActionResult,
    values: ArticleParams,
  ) => Promise<ActionResult>;
}

type UploadError = {
  status: typeof ActionResultStatuses.ERROR;
  message: string;
} | null;

const statusOptions = [
  {
    value: ArticleStatuses.DRAFT,
    label: toSentenceCase(ArticleStatuses.DRAFT),
  },
  {
    value: ArticleStatuses.PUBLISHED,
    label: "Publish",
  },
];

export function ArticleForm(props: Props) {
  const { article, submitAction } = props;
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<UploadError>(null);
  const [submitResult, formAction, pending] = useActionState(submitAction, {
    status: ActionResultStatuses.IDLE,
  });
  const submitting = uploading || pending;

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: article?.title ?? "",
      body: article?.body ?? "",
      featuredImageUrl: article?.featuredImageUrl ?? null,
      date: article?.date ?? new Date(),
      status: article?.status ?? ArticleStatuses.DRAFT,
    },
    validate: zod4Resolver(articleScheme),
    transformValues: (values) => ({
      ...values,
      date: new Date(values.date),
    }),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    if (submitting) return;
    if (featuredImage) {
      setUploading(true);
      try {
        values.featuredImageUrl = (await uploadImage(featuredImage)).url;
      } catch (_error) {
        setUploadError({
          status: ActionResultStatuses.ERROR,
          message: "Failed to upload image.\nPlease try again later.",
        });
        return;
      } finally {
        setUploading(false);
      }
    }
    startTransition(() => {
      formAction(values);
    });
  });

  useFlashMessage(submitResult);
  useFlashMessage(uploadError);

  return (
    <form onSubmit={handleSubmit}>
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
        <Button type="submit" loading={submitting} aria-label="Submit">
          <Text size="sm">Submit</Text>
        </Button>
      </Box>
    </form>
  );
}
