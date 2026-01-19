export function extractProperty(page: any, propertyName: string, type: string): any {
  const prop = page.properties[propertyName];
  if (!prop) return null;

  switch (type) {
    case "title":
      return prop.title?.[0]?.plain_text || "";
    case "rich_text":
      return prop.rich_text?.[0]?.plain_text || "";
    case "email":
      return prop.email || "";
    case "url":
      return prop.url || "";
    case "files":
    case "file":
      // Files/Media property - can contain external URLs or uploaded files
      if (prop.files && prop.files.length > 0) {
        const firstFile = prop.files[0];
        // External file (URL)
        if (firstFile.type === "external" && firstFile.external?.url) {
          return firstFile.external.url;
        }
        // Uploaded file (Notion hosted)
        if (firstFile.type === "file" && firstFile.file?.url) {
          return firstFile.file.url;
        }
      }
      return null;
    case "select":
      return prop.select?.name || "";
    case "number":
      return prop.number || 0;
    case "date":
      return prop.date?.start || "";
    case "multi_select":
      return prop.multi_select?.map((item: any) => item.name) || [];
    default:
      return null;
  }
}

