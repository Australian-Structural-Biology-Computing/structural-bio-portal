// utils/parseWorkflowSchema.ts
import { InputParams, WorkflowParams } from "@/models/workflow";

const EXCLUDED_GROUPS = new Set([
  "input_output_options",
  "max_job_request_options",
  "generic_options",
  "institutional_config_options"
]);

export async function parseWorkflowSchema(
  schemaUrl: string
): Promise<WorkflowParams> {
  const res = await fetch(schemaUrl);
  if (!res.ok) throw new Error("Failed to fetch workflow schema");

  const data = await res.json();
  const paramsSchema = data.$defs || data.definitions;
  const parsedParams: WorkflowParams = {};

  Object.entries(paramsSchema)
    .filter(([key]) => !EXCLUDED_GROUPS.has(key))
    .forEach(([groupKey, groupValue]: [string, any]) => {
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
      parsedParams[groupKey] = inputs;
    });

  return parsedParams;
}
