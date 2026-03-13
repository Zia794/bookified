"use client";

import React, { useCallback, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { X } from "lucide-react";
import { FileUploadFieldProps } from "@/types";
import { cn } from "@/lib/utils";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

// helper component rendered by the FormField render prop
// so that we can use hooks normally.

interface FileUploaderFieldProps<T extends FieldValues> {
  field: {
    onChange: (...args: any[]) => void;
    value: any;
  };
  label: string;
  acceptTypes: string[];
  disabled?: boolean;
  icon: React.ComponentType<any>;
  placeholder?: string;
  hint?: string;
  removeLabel?: string;
}

function FileUploaderField<T extends FieldValues>({
  field: { onChange, value },
  label,
  acceptTypes,
  disabled,
  icon: Icon,
  placeholder,
  hint,
  removeLabel = "Remove file",
}: FileUploaderFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange],
  );

  const onRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onChange],
  );

  const isUploaded = !!value;

  return (
    <FormItem className="w-full">
      <FormLabel className="form-label">{label}</FormLabel>
      <FormControl>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          className={cn(
            "upload-dropzone border-2 border-dashed border-[#8B7355]/20",
            isUploaded && "upload-dropzone-uploaded",
          )}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <input
            type="file"
            accept={acceptTypes.join(",")}
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            disabled={disabled}
          />

          {isUploaded ? (
            <div className="flex flex-col items-center relative w-full px-4">
              <p className="upload-dropzone-text line-clamp-1">
                {(value as File).name}
              </p>
              <button
                type="button"
                onClick={onRemove}
                className="upload-dropzone-remove mt-2"
                aria-label={removeLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Icon className="upload-dropzone-icon" />
              <p className="upload-dropzone-text">{placeholder}</p>
              <p className="upload-dropzone-hint">{hint}</p>
            </>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

const FileUploader = <T extends FieldValues>({
  control,
  name,
  label,
  acceptTypes,
  disabled,
  icon: Icon,
  placeholder,
  hint,
  removeLabel = "Remove file",
}: FileUploadFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name as any}
      render={(props) => (
        <FileUploaderField
          {...props}
          label={label}
          acceptTypes={acceptTypes}
          disabled={disabled}
          icon={Icon}
          placeholder={placeholder}
          hint={hint}
          removeLabel={removeLabel}
        />
      )}
    />
  );
};

export default FileUploader;
