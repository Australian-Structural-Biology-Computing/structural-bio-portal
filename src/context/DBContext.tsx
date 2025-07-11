import React, { createContext, useContext, useEffect, useState } from "react";
import { Workflows, WorkflowContextType } from "@/models/workflow";
import { GridNoColumnsOverlay } from "@mui/x-data-grid";

const DBContext = createContext<WorkflowContextType | undefined>(
  undefined
);
export const WorkflowsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [themes, setThemes] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<Workflows[] | null>(null);
  useEffect(() => {
    const fetchWorkflows = async () => {
      const res = await fetch("/db.json");
      const data = await res.json();
      // get themes list
      const themesList = Array.isArray(data)
        ? data.map((theme) => Object.keys(theme)[0])
        : [];
      // get and merge all pre-config workflows
      const workflowsList = Array.isArray(data)
        ? data.flatMap((categoryObj) => {
          const [categoryName, categoryData]: [any, any] =
            Object.entries(categoryObj)[0];
          return categoryData.preconfig.flatMap(
            (subcatGroup: Record<string, any>) => {
              return Object.entries(subcatGroup).flatMap(
                ([subcatName, subcatValue]) => {
                  // deal with all-in-one workflow: proteinfold
                  if (subcatName === "single_structure_prediction") {
                    return {
                      ...(subcatValue as Record<string, any>),
                      title: subcatName
                    };
                  }
                  return (subcatValue.tools || []).map((tool: any) => ({
                    ...tool,
                    category: categoryName,
                    subcategory: subcatName
                  }));
                }
                  
              )
            }
              
          );
        }) : [];
      setThemes(themesList);
      setWorkflows(workflowsList);
    };
    fetchWorkflows();
  }, []);

  return (
    <DBContext.Provider value={{ workflows, themes }}>
      {children}
    </DBContext.Provider>
  );
};

export const useWorkflows = () => {
  const context = useContext(DBContext);
  return context;
};
