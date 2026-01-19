import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type PropertyType =
  | "title"
  | "rich_text"
  | "email"
  | "url"
  | "files"
  | "file"
  | "select"
  | "number"
  | "date"
  | "multi_select";

function extractProperty(
  page: PageObjectResponse,
  propertyName: string,
  type: "title" | "rich_text" | "email" | "url" | "select" | "date"
): string;
function extractProperty(
  page: PageObjectResponse,
  propertyName: string,
  type: "number"
): number;
function extractProperty(
  page: PageObjectResponse,
  propertyName: string,
  type: "multi_select"
): string[];
function extractProperty(
  page: PageObjectResponse,
  propertyName: string,
  type: "files" | "file"
): string | null | undefined;
function extractProperty(
  page: PageObjectResponse,
  propertyName: string,
  type: PropertyType
): string | number | string[] | null | undefined {
  const prop = page.properties[propertyName];
  if (!prop) return null;

  switch (type) {
    case "title": {
      const titleProp = prop as { title?: Array<{ plain_text?: string }> };
      return titleProp.title?.[0]?.plain_text || "";
    }
    case "rich_text": {
      const richTextProp = prop as { rich_text?: Array<{ plain_text?: string }> };
      return richTextProp.rich_text?.[0]?.plain_text || "";
    }
    case "email": {
      const emailProp = prop as { email?: string };
      return emailProp.email || "";
    }
    case "url": {
      const urlProp = prop as { url?: string };
      return urlProp.url || "";
    }
    case "files":
    case "file": {
      const filesProp = prop as {
        files?: Array<{
          type?: string;
          external?: { url?: string };
          file?: { url?: string };
        }>;
      };
      if (filesProp.files && filesProp.files.length > 0) {
        const firstFile = filesProp.files[0];
        if (firstFile.type === "external" && firstFile.external?.url) {
          return firstFile.external.url;
        }
        if (firstFile.type === "file" && firstFile.file?.url) {
          return firstFile.file.url;
        }
      }
      return null;
    }
    case "select": {
      const selectProp = prop as { select?: { name?: string } };
      return selectProp.select?.name || "";
    }
    case "number": {
      const numberProp = prop as { number?: number };
      return numberProp.number || 0;
    }
    case "date": {
      const dateProp = prop as { date?: { start?: string } };
      return dateProp.date?.start || "";
    }
    case "multi_select": {
      const multiSelectProp = prop as {
        multi_select?: Array<{ name?: string }>;
      };
      return multiSelectProp.multi_select?.map((item) => item.name || "") || [];
    }
    default:
      return null;
  }
}

export { extractProperty };

