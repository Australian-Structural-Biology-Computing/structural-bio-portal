"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import { Workflows, WorkflowContextType } from "@/models/workflow";

const WorkflowsContext = createContext<WorkflowContextType | undefined>(undefined)
export const WorkflowsProvider = ({ children }: { children: React.ReactNode }) => {
    const [workflows, setWorkflows] = useState<Workflows[] | null>(null);
    useEffect(() => {
        const fetchWorkflows = async () => {
            const res = await fetch("/workflows.json")
            const data = await res.json()
            setWorkflows(data)
        }
        fetchWorkflows()
    }, []
    )
    return <WorkflowsContext.Provider value={{ workflows }}>{children}</WorkflowsContext.Provider>
}

export const useWorkflows = () => {
    const context = useContext(WorkflowsContext);
    return context
}