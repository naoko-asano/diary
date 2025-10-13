import { findArticleById } from "@/features/articles/services";

type Props = {
  params: Promise<Params>;
};

type Params = { id: string };

export default async function Page(props: Props) {
  const { id } = await props.params;
  const article = await findArticleById(Number(id));
  return (
    <>
      <div>Article Editing Page</div>
      <div>title: {article?.title}</div>
      <div>body: {article?.body}</div>
    </>
  );
}
