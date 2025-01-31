import { Category } from "@/app/types/category";
import { getDb } from "@/app/models/db";

export async function getCategories(
  page: number,
  limit: number
): Promise<Category[] | undefined> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `select * from categories order by sort desc limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  let categories: Category[] = [];

  const { rows } = res;
  rows.forEach((row) => {
    categories.push({
      slug: row.slug,
      name: row.name,
      sort: row.sort,
    });
  });

  return categories;
}

export async function findCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const db = getDb();
  const res = await db.query(
    `SELECT * FROM categories WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;
  const row = rows[0];
  const category: Category = {
    slug: row.slug,
    name: row.name,
    sort: row.sort,
  };

  return category;
}

export async function insertCategory(slug: string, name: string, sort: number) {
  const db = getDb();
  await db.query(
    `insert into categories (slug, name, sort) values ($1, $2, $3)`,
    [slug, name, sort]
  );

  return;
}
