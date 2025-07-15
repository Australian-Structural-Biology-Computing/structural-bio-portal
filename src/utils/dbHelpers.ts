import {
  RawDB,
  RawThemes,
  RawTool,
  ThemesContext,
  Workflows
} from "@/models/workflow";

// extractThemes
function extractThemes(data: RawDB[]): ThemesContext[] {
  const allEntries: ThemesContext[] = [];

  data.forEach((themeObj) => {
    const entries = Object.entries(themeObj).map(
      ([eKey, value]: [string, RawThemes]) => {
        const preconfigKeys = value.preconfig.flatMap((p) => Object.keys(p));
        allEntries.push({
          [eKey]: {
            key: preconfigKeys.join(","),
            description: value.description
          }
        });
      }
    );
  });
  return allEntries;
}

// transformWorkflows: merges all preconfig workflows from db.json content into Workflows[]
function transformWorkflows(data: RawDB[]): Workflows[] {
  return data.flatMap((categoryObj) => {
    const [categoryName, categoryData] = Object.entries(categoryObj)[0];

    return categoryData.preconfig.flatMap((subcatGroup) =>
      Object.entries(subcatGroup).flatMap(([subcatName, subcatValue]) => {
        // Normal case: workflow with multiple tools repos
        return (subcatValue.tools || []).map((tool: RawTool) => ({
          ...tool,
          theme: categoryName,
          preconfig: subcatName
        }));
      })
    );
  });
}

// fetch from DB and transform
export default async function fetchWorkflowsFromDB(): Promise<{
  themes: ThemesContext[];
  workflows: Workflows[];
}> {
  const res = await fetch("/db.json");
  const data: RawDB[] = await res.json();
  return {
    themes: extractThemes(data),
    workflows: transformWorkflows(data)
  };
}
