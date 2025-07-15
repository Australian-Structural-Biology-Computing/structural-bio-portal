import React, { createContext, useContext, useEffect, useState } from "react";
import { Workflows, WorkflowContextType } from "@/models/workflow";
import fetchWorkflowsFromDB from "@/utils/dbHelpers";

const DBContext = createContext<WorkflowContextType | undefined>(undefined);
export const WorkflowsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [themes, setThemes] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<Workflows[] | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      const { themes, workflows } = await fetchWorkflowsFromDB();
      setThemes(themes);
      setWorkflows(workflows);
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
