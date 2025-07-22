import { WorkflowParams } from "@/models/workflow";

/**
 * Flattens nested workflow‐parameter form data and
 * converts values to the correct types based on the schema.
 *
 * @param data    The raw form values from react‑hook‑form (all strings).
 * @param wParams The workflow parameter schema grouped by accordion section.
 * @returns       An object with correctly‑typed, flat key/value pairs.
 */
export function convertFormData(
  data: Record<string, any>,
  wParams: WorkflowParams
): Record<string, any> {
  const flat: Record<string, any> = {};

  Object.values(wParams).forEach((inputs) => {
    inputs.forEach((param) => {
      const rawValue = data[param.key];

      if (rawValue === undefined || rawValue === "") return;

      switch (param.type) {
        case "integer":
          flat[param.key] = Number(rawValue);
          break;
        case "boolean":
          flat[param.key] = rawValue === "true" || rawValue === true;
          break;
        default:
          flat[param.key] = rawValue;
      }
    });
  });

  return flat;
}
