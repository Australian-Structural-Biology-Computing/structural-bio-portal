import { RawDB, RawTool, Workflows } from "@/models/workflow";

// extractThemes: gets ["protein_design", "structure_prediction", ...]
function extractThemes(data: RawDB[]): string[] {
  return data.map((themeObj) => Object.keys(themeObj)[0]);
}

// transformWorkflows: merges all preconfig workflows from db.json content into Workflows[]
function transformWorkflows(data: RawDB[]): Workflows[] {
  return data.flatMap((categoryObj) => {
    const [categoryName, categoryData] = Object.entries(categoryObj)[0];

    return categoryData.preconfig.flatMap((subcatGroup) =>
      Object.entries(subcatGroup).flatMap(([subcatName, subcatValue]) => {
        // Special case: all-in-one workflow in single_structure_prediction

        // Normal case: workflow with multiple tools repos
        return (subcatValue.tools || []).map((tool: RawTool) => ({
          ...tool,
          theme: categoryName,
          preconfig: subcatName,
          revision: tool.revision,
          configProfiles: tool.configProfiles
        }));
      })
    );
  });
}

// fetch from DB and transform
export default async function fetchWorkflowsFromDB(): Promise<{
  themes: string[];
  workflows: Workflows[];
}> {
  const res = await fetch("/db.json");
  const data: RawDB[] = await res.json();
  return {
    themes: extractThemes(data),
    workflows: transformWorkflows(data)
  };
}
