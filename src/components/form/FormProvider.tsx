import { FormProvider as RFormProvider, UseFormReturn } from "react-hook-form";
import { ReactNode, FormEventHandler } from "react";

type FormProviderProps = {
    children: ReactNode;
    onSubmit: FormEventHandler;
    methods: UseFormReturn;
}

function FormProvider({ children, onSubmit, methods } : FormProviderProps) {
    return (
      <RFormProvider {...methods}>
        {children}
      </RFormProvider>
    );
}

export default FormProvider;