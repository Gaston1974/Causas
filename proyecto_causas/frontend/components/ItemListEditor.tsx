"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type FieldType = "text" | "select" | "textarea" | "date" | "number"

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { value: string; label: string }[]
  colSpan?: 1 | 2
  required?: boolean
}

interface ItemListEditorProps<T extends Record<string, any>> {
  title: string
  icon?: React.ReactNode
  items: T[]
  fields: FieldConfig[]
  onAdd: (item: T) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, item: T) => void
  emptyMessage?: string
  addLabel?: string
  accentColor?: string
}

function createEmptyItem<T>(fields: FieldConfig[]): T {
  const obj: Record<string, any> = {}
  fields.forEach((f) => {
    obj[f.name] = f.type === "select" && f.options?.length ? f.options[0].value : ""
  })
  return obj as T
}

function ItemRow<T extends Record<string, any>>({
  item,
  index,
  fields,
  onRemove,
  onUpdate,
}: {
  item: T
  index: number
  fields: FieldConfig[]
  onRemove: (i: number) => void
  onUpdate: (i: number, item: T) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  const handleChange = (name: string, value: string) => {
    onUpdate(index, { ...item, [name]: value })
  }

  // preview label = first non-empty field value
  const previewValue = fields
    .map((f) => item[f.name])
    .find((v) => v && String(v).trim() !== "") || `Ítem ${index + 1}`

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden bg-card shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/40">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          <span className="truncate max-w-[200px] sm:max-w-sm">{previewValue}</span>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Fields grid */}
      {!collapsed && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field) => (
            <div
              key={field.name}
              className={cn("space-y-1.5", field.colSpan === 2 && "sm:col-span-2")}
            >
              <Label htmlFor={`field-${index}-${field.name}`} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "select" ? (
                <Select
                  value={item[field.name] || ""}
                  onValueChange={(v) => handleChange(field.name, v)}
                >
                  <SelectTrigger id={`field-${index}-${field.name}`} className="h-9 text-sm">
                    <SelectValue placeholder={field.placeholder || `Seleccionar ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={`field-${index}-${field.name}`}
                  value={item[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-[72px] text-sm resize-none"
                />
              ) : (
                <Input
                  id={`field-${index}-${field.name}`}
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                  value={item[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="h-9 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ItemListEditor<T extends Record<string, any>>({
  title,
  icon,
  items,
  fields,
  onAdd,
  onRemove,
  onUpdate,
  emptyMessage = "No hay ítems cargados.",
  addLabel = "Agregar",
}: ItemListEditorProps<T>) {
  const handleAdd = () => {
    onAdd(createEmptyItem<T>(fields))
  }

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
          {items.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold">
              {items.length}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="h-8 gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="border border-dashed border-border/60 rounded-lg py-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <ItemRow
              key={index}
              item={item}
              index={index}
              fields={fields}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
