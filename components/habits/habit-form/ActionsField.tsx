import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@components/ui/label";
import {
  CircleX,
  Plus,
  CircleAlert,
  OctagonAlert,
  Hash,
  Clock,
  Edit2,
} from "lucide-react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";

type ActionsFieldProps = {
  control: Control<HabitZodType>;
};

export function ActionsField({ control }: ActionsFieldProps) {
  const [actionForm, setActionForm] = useState<{
    action: string;
    metric: "count" | "time";
    type: "offensive" | "defensive";
  }>({
    action: "",
    metric: "count",
    type: "offensive",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "actions",
  });

  const actions = useWatch({
    control,
    name: "actions",
    defaultValue: [],
  });

  const handleActionSubmit = () => {
    if (actionForm.action !== "") {
      if (editIndex !== null) {
        update(editIndex, { ...actionForm, value: actions[editIndex].value });
        setEditIndex(null);
      } else {
        append({ ...actionForm, value: 0 });
      }
      setActionForm({ action: "", metric: "count", type: "offensive" });
      setIsDrawerOpen(false);
    }
  };

  const removeAction = (index: number) => {
    remove(index);
  };

  const editAction = (index: number) => {
    setActionForm(actions[index]);
    setEditIndex(index);
    setIsDrawerOpen(true);
  };

  return (
    <FormField
      control={control}
      name="actions"
      render={() => (
        <FormItem>
          <FormLabel>Actions</FormLabel>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              const action = actions[index];
              if (!action) return null;
              return (
                <div key={field.id} className="border p-4 rounded-md">
                  <div className="text flex justify-between items-center border-b pb-1 mb-2">
                    <div className="flex items-center">
                      {action.type === "offensive" ? (
                        <CircleAlert className="mr-2 text-blue-500" size={20} />
                      ) : (
                        <OctagonAlert
                          className="mr-2 text-blue-500"
                          size={20}
                        />
                      )}
                      {action.action}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-red-500"
                        aria-label={`Remove action ${action.action}`}
                      >
                        <CircleX size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-1">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="capitalize">
                        {action.type}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {action.metric === "count" ? (
                          <Hash size={18} className="mr-2" />
                        ) : (
                          <Clock size={18} className="mr-2" />
                        )}
                        {action.metric}
                      </Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => editAction(index)}
                      aria-label={`Edit action ${action.action}`}
                      className="flex items-center mr-2 text-blue-500"
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button type="button" variant="outline" className="w-full mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Action
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-w-md mx-auto left-0 right-0">
              <DrawerHeader>
                <DrawerTitle className="text-center mb-8">
                  {editIndex !== null ? "Edit Action" : "Add New Action"}
                </DrawerTitle>
              </DrawerHeader>

              <div className="p-4 pb-0">
                <span>
                  <Badge variant="secondary" className="text-sm">
                    {actionForm.type === "offensive" ? "I will" : "I won't"}
                  </Badge>
                </span>
                <FormControl>
                  <Input
                    value={actionForm.action}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, action: e.target.value })
                    }
                    placeholder="Enter action"
                    className="mt-2 mb-8 text-base"
                  />
                </FormControl>

                <Label>Action type</Label>
                <Select
                  value={actionForm.type}
                  onValueChange={(value: "offensive" | "defensive") =>
                    setActionForm({ ...actionForm, type: value })
                  }
                >
                  <SelectTrigger className="my-4 mb-8">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offensive">
                      <span className="flex items-center">
                        <CircleAlert className="text-blue-500 mr-2" size={20} />
                        Offensive
                      </span>
                    </SelectItem>
                    <SelectItem value="defensive">
                      <span className="flex items-center">
                        <OctagonAlert
                          className="text-blue-500 mr-2"
                          size={20}
                        />
                        Defensive
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Label>Action tracking metric</Label>
                <Select
                  value={actionForm.metric}
                  onValueChange={(value: "count" | "time") =>
                    setActionForm({ ...actionForm, metric: value })
                  }
                >
                  <SelectTrigger className="mt-4 mb-24">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">
                      <span className="flex items-center">
                        <Hash size={18} className="mr-2" />
                        Count
                      </span>
                    </SelectItem>
                    <SelectItem value="time">
                      <span className="flex items-center">
                        <Clock size={18} className="mr-2" />
                        Time
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleActionSubmit} className="w-full mb-4">
                  {editIndex !== null ? "Update Action" : "Add Action"}
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}