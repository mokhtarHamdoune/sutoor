"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, CreateCategoryInput } from "../schema";
import { Input } from "@/client/shared/ui/input";
import { Textarea } from "@/client/shared/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/client/shared/ui/field";

interface CategoryFormProps {
  formId: string;
  onSubmit: (data: CreateCategoryInput) => void;
  isPending?: boolean;
}

export function CategoryForm({
  formId,
  onSubmit,
  isPending,
}: CategoryFormProps) {
  const { handleSubmit, control } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="label"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${formId}-label`}>Label</FieldLabel>
              <Input
                {...field}
                id={`${formId}-label`}
                aria-invalid={fieldState.invalid}
                placeholder="Category name"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${formId}-description`}>
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id={`${formId}-description`}
                aria-invalid={fieldState.invalid}
                placeholder="Category description"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
