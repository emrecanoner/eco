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

