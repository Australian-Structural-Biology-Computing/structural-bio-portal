"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/DBContext";
import FormProvider from "@/components/form/FormProvider";
import { WorkflowParams } from "@/models/workflow";
import ParamAccordionGroup from "@/components/ParamsAccordion";
import { parseWorkflowSchema } from "@/utils/parseWorkflowSchema";

export default function WorkflowParamsPage({ methods }: { methods: UseFormReturn<any> }) {
  const context = useWorkflows();
  const workflows = context?.workflows;
  const params = useRouter();
  const workflowId = Number(params?.query?.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);
  const [wParams, setWParams] = useState<WorkflowParams>({});

  useEffect(() => {
    if (!workflow?.schema) return;

    const loadParams = async () => {
      try {
        const parsed = await parseWorkflowSchema(workflow.schema);
        setWParams(parsed);
      } catch (error) {
        console.error("Error loading workflow schema:", error);
      }
    };

    loadParams();
  }, [workflow?.schema]);
  return (
    <FormProvider methods={methods}>
      {Object.entries(wParams).map(([groupKey, groupParams]) => (
        <ParamAccordionGroup
          key={groupKey}
          groupKey={groupKey}
          groupParams={groupParams}
        />
      ))}
    </FormProvider>
  );
}
