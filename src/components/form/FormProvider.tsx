import { FormProvider as RFormProvider, UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

type FormProviderProps = {
  children: ReactNode;
  methods: UseFormReturn;
};

function FormProvider({ children, methods }: FormProviderProps) {
  return <RFormProvider {...methods}>{children}</RFormProvider>;
}

export default FormProvider;