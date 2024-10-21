import { CustomFieldType } from "@prisma/client";
import { z } from "zod";

export type Column = {
  name: ColumnLabelKey;
  visible: boolean;
  position: number;
  cfType?: CustomFieldType;
};
// Define the fixed fields
export const fixedFields = [
  "id",
  "qrId",
  "status",
  "description",
  "valuation",
  "availableToBook",
  "createdAt",
  "category",
  "tags",
  "location",
  "kit",
  "custody",
] as const;

export type FixedField = (typeof fixedFields)[number];

// Define a type for custom fields column names that start with "cf_"
type CustomFieldColumnKey = `cf_${string}`;

// Define a new type that includes both FixedField and the additional key "name"
export type ColumnLabelKey = FixedField | "name" | CustomFieldColumnKey;

export const columnsLabelsMap: { [key in ColumnLabelKey]: string } = {
  id: "ID",
  qrId: "QR ID",
  name: "Name",
  status: "Status",
  description: "Description",
  valuation: "Value",
  availableToBook: "Available to book",
  createdAt: "Created at",
  category: "Category",
  tags: "Tags",
  location: "Location",
  kit: "Kit",
  custody: "Custody",
};

export const defaultFields: Column[] = [
  { name: "id", visible: true, position: 0 },
  { name: "qrId", visible: true, position: 1 },
  { name: "status", visible: true, position: 2 },
  { name: "description", visible: true, position: 3 },
  { name: "valuation", visible: true, position: 4 },
  { name: "availableToBook", visible: true, position: 5 },
  { name: "createdAt", visible: true, position: 6 },
  { name: "category", visible: true, position: 7 },
  { name: "tags", visible: true, position: 8 },
  { name: "location", visible: true, position: 9 },
  { name: "kit", visible: true, position: 10 },
  { name: "custody", visible: true, position: 11 },
];

// export const generateColumnsSchema = (customFields: string[]) => {
//   // Combine fixed and custom fields to form ColumnLabelKey
//   const allFields = [
//     ...fixedFields,
//     ...customFields.map((cf) => `cf_${cf}`),
//   ] as const;

//   // Create Zod schema for the name field based on all possible fields (ColumnLabelKey)
//   let nameSchema: z.ZodType<ColumnLabelKey>;
//   if (allFields.length === 1) {
//     nameSchema = z.literal(allFields[0]); // Single field case
//   } else if (allFields.length >= 2) {
//     nameSchema = z.union(
//       allFields.map((field) => z.literal(field)) as [
//         z.ZodLiteral<ColumnLabelKey>,
//         z.ZodLiteral<ColumnLabelKey>,
//         ...z.ZodLiteral<ColumnLabelKey>[],
//       ]
//     );
//   } else {
//     throw new Error("There should be at least one field to validate");
//   }

//   // Create Zod schema for each column object
//   const columnSchema = z.object({
//     name: nameSchema, // Name must be one of the fixed or custom fields (ColumnLabelKey)
//     visible: z
//       .union([z.boolean(), z.string()])
//       .transform((val) => val === "on" || val === true)
//       .default(false),
//     position: z.union([z.string(), z.number()]).transform(Number),
//     cfType: z.nativeEnum(CustomFieldType).optional(),
//   });

//   // Return the final schema
//   return z.object({
//     intent: z.literal("changeColumns"),
//     columns: z.array(columnSchema), // Validate columns as an array of Column objects
//   });
// };

export const generateColumnsSchema = (customFields: string[]) => {
  // Combine fixed and custom fields to form ColumnLabelKey
  const allFields = [
    ...fixedFields,
    "name", // Explicitly include "name"
    ...customFields,
  ] as const;

  // Create a union type of all possible field names
  const nameSchema = z.enum(allFields);

  // Create Zod schema for each column object
  const columnSchema = z.object({
    name: nameSchema,
    visible: z
      .union([z.boolean(), z.literal("on")])
      .transform((val) => val === true || val === "on")
      .default(false),
    position: z.union([z.string(), z.number()]).transform(Number),
    cfType: z.nativeEnum(CustomFieldType).optional(),
  });

  // Return the final schema
  return z.object({
    intent: z.literal("changeColumns"),
    columns: z.array(columnSchema),
  });
};

export function parseColumnName(name: string) {
  /** For custom fields, strip the CF */
  if (name.startsWith("cf_")) {
    return name.slice(3);
  }

  /** For fixed fields, return the label */
  return columnsLabelsMap[name as keyof typeof columnsLabelsMap];
}
