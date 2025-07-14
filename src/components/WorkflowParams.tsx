"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/WorkflowsContext";
import FormProvider from "@/components/form/FormProvider";
import { InputParams, WorkflowParams } from "@/models/workflow";
import ParamAccordionGroup from "@/components/ParamsAccordion";

export default function WorkflowParamsPage({
  onSubmit,
  methods
}: {
  onSubmit: (formValues: any) => void;
  methods: UseFormReturn<any>;
}) {
  const context = useWorkflows();
  const workflows = context?.workflows;
  const params = useRouter();
  const workflowId = Number(params?.query?.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);
  const [wParams, setWParams] = useState<WorkflowParams>({});

  useEffect(() => {
    const fetchSchema = async () => {
      if (!workflow?.schema) return;
      const res = await fetch(workflow.schema);
      const data = await res.json();

      const paramsSchema = data.$defs || data.definitions;
      // exclude the following params
      const excludeParams = [
        "input_output_options",
        "max_job_request_options",
        "generic_options",
        "institutional_config_options"
      ];

      const params: WorkflowParams = Object.entries(paramsSchema)
        .filter(([key]) => !excludeParams.includes(key))
        .reduce(
          (acc: WorkflowParams, [groupKey, groupValue]: [string, any]) => {
            const props = groupValue?.properties ?? {};
            const inputs: InputParams[] = Object.entries(props).map(
              ([paramKey, paramValue]: [string, any]) => ({
                key: paramKey,
                description: paramValue?.description,
                format: paramValue?.format,
                enum: paramValue?.enum || [],
                default: paramValue?.default || "",
                help_text: paramValue?.help_text,
                pattern: paramValue?.pattern,
                type: paramValue?.type,
                required: false
              })
            );

            acc[groupKey] = inputs;
            return acc;
          },
          {}
        );

      setWParams(params);
    };

    fetchSchema();
  }, [workflow?.schema]);

  return (
    <FormProvider methods={methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          console.log("submitted: ", data);
          onSubmit(data);
        })}
      >
        {Object.entries(wParams).map(([groupKey, groupParams]) => (
          <ParamAccordionGroup
            key={groupKey}
            groupKey={groupKey}
            groupParams={groupParams}
          />
        ))}
      </form>
    </FormProvider>
  );
}
