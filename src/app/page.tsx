import { Button } from "@/components/ui/Button";
import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();
  return (
    <div>
      Diary
      <div>
        {articles.map((article) => (
          <div key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.body}</p>
          </div>
        ))}
      </div>
      <Button />
    </div>
  );
}
