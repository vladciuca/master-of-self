import { useState } from "react";
import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@components/ui/scroll-area";
import { Label } from "@components/ui/label";
import { CircleX, Plus, Edit2, ArrowBigRightDash } from "lucide-react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { HabitZodType } from "@models/habitFormSchema";
import { HabitAction } from "@models/types";
import { Slider } from "@components/ui/slider";
import { useSideContentPosition } from "@hooks/useSideContentPosition";

type ActionsFieldProps = {
  control: Control<HabitZodType>;
  type: "Create" | "Update";
};

const initialActionForm = {
  action: "",
  actionUnit: "",
  metric: "count" as const,
  type: "offensive" as const,
  dailyTarget: 1,
};

export function ActionsField({ control, type }: ActionsFieldProps) {
  const [actionForm, setActionForm] = useState<
    Omit<HabitAction, "id" | "value">
  >({
    action: "",
    metric: "count",
    actionUnit: "",
    type: "offensive",
    dailyTarget: 1,
  });
  const [inputError, setInputError] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const { drawerStyle } = useSideContentPosition();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "actions",
  });

  const actions = useWatch({
    control,
    name: "actions",
    defaultValue: [],
  }) as HabitAction[];

  const handleActionSubmit = () => {
    if (actionForm.action !== "") {
      setInputError(false);
      if (editId !== null) {
        // Find the index of the action with the matching id
        const editIndex = actions.findIndex((action) => action.id === editId);
        if (editIndex !== -1) {
          update(editIndex, {
            ...actionForm,
            id: editId,
            value: actions[editIndex].value,
          });
        }
        setEditId(null);
      } else {
        // Add a new action with a unique id
        append({ ...actionForm, id: crypto.randomUUID(), value: 0 });
      }
      resetActionForm();
      setIsDrawerOpen(false);
    }
    setInputError(true);
  };

  const removeAction = (id: string) => {
    // Find the index of the action with the matching id
    const removeIndex = actions.findIndex((action) => action.id === id);
    if (removeIndex !== -1) {
      remove(removeIndex);
    }
  };

  const editAction = (id: string) => {
    const actionToEdit = actions.find((action) => action.id === id);
    if (actionToEdit) {
      setActionForm({
        action: actionToEdit.action,
        actionUnit: actionToEdit.actionUnit,
        metric: actionToEdit.metric,
        type: actionToEdit.type,
        dailyTarget: actionToEdit.dailyTarget,
      });
      setEditId(id);
      setIsDrawerOpen(true);
    }
  };

  const resetActionForm = () => {
    setActionForm(initialActionForm);
    setEditId(null);
  };

  const handleAddActionClick = () => {
    resetActionForm();
    setIsDrawerOpen(true);
  };

  return (
    <FormField
      control={control}
      name="actions"
      render={() => (
        <FormItem>
          <FormLabel>Habit Actions</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Define a specific, measurable action you'll take each day to build
              or break a habit. Be concrete and realistic - this should be
              something you can clearly track as completed or not completed.
            </FormDescription>
          )}
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              const action = actions[index] as HabitAction;
              if (!action) return null;
              return (
                <div key={action.id} className="border p-2 rounded-md">
                  <div className="flex items-start max-w-full border-b pb-1 mb-2">
                    <span className="flex flex-shrink-0 items-start mt-[3.2px]">
                      <ActionIcon type={action.type} size={18} />
                    </span>
                    <span className="mr-1 text-bold">
                      {action.type === "offensive" ? "I will" : "I won't"}
                    </span>
                    <span className="text-base break-words whitespace-normal w-0 flex-grow">
                      {action.action}
                    </span>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeAction(action.id)}
                        className="text-red-500"
                        aria-label={`Remove action ${action.action}`}
                      >
                        <CircleX size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-1">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">
                        Daily {action.type === "offensive" ? "Target" : "Limit"}
                        :
                      </span>
                      <span className="mx-1">
                        <MetricIcon metric={action.metric} size={18} />
                      </span>
                      {action.dailyTarget} {action.actionUnit}
                    </div>

                    <button
                      type="button"
                      onClick={() => editAction(action.id)}
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
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={handleAddActionClick}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Action
              </Button>
            </DrawerTrigger>
            <DrawerContent
              className="max-w-md mx-auto right-0 left-0"
              style={drawerStyle}
            >
              <DrawerHeader>
                <DrawerTitle className="text-center flex flex-col">
                  {editId !== null ? "Edit Action" : "Add New Action"}
                  <div className="w-full">
                    <div className="flex items-center justify-center space-x-4 mt-6">
                      <ActionIcon
                        type={actionForm.type}
                        dailyTargetCompleted={false}
                        overCapped={false}
                        size={30}
                      />
                      <ArrowBigRightDash />
                      <ActionIcon
                        type={actionForm.type}
                        dailyTargetCompleted={true}
                        overCapped={false}
                        size={30}
                      />
                    </div>
                  </div>
                </DrawerTitle>
                <DrawerDescription>
                  {editId !== null
                    ? "Edit your habit action details below"
                    : "Add a new habit action by filling out the details below"}
                </DrawerDescription>
              </DrawerHeader>

              <ScrollArea className="h-[65vh] p-4">
                <div className="px-1">
                  <Label>I want to...</Label>
                  <Select
                    value={actionForm.type}
                    onValueChange={(value: "offensive" | "defensive") =>
                      setActionForm({ ...actionForm, type: value })
                    }
                  >
                    <SelectTrigger className="my-2 mb-4">
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offensive">
                        <span className="flex items-center">
                          <ActionIcon type={"offensive"} size={20} />
                          Build a habit
                        </span>
                      </SelectItem>
                      <SelectItem value="defensive">
                        <span className="flex items-center">
                          <ActionIcon type={"defensive"} size={20} />
                          Break a habit
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>
                    {actionForm.type === "offensive"
                      ? "I will..."
                      : "I won't..."}
                  </Label>
                  {editId === null && (
                    <FormDescription className="text-xs">
                      Describe the specific action you'll take. Make it clear
                      and measurable.
                    </FormDescription>
                  )}
                  <FormControl>
                    <Input
                      placeholder="e.g., Do pushups, Read books, Meditate"
                      value={actionForm.action}
                      onChange={(e) => {
                        setActionForm({
                          ...actionForm,
                          action: e.target.value,
                        });
                        setInputError(false);
                      }}
                      className={`mt-2 mb-8 text-base ${
                        inputError ? "border-destructive" : ""
                      }`}
                    />
                  </FormControl>

                  {/* <Label>Action tracking metric</Label>
                <Select
                  value={actionForm.metric}
                  onValueChange={(value: "count" | "time") =>
                    setActionForm({ ...actionForm, metric: value })
                  }
                >
                  <SelectTrigger className="my-2 mb-4">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">
                      <span className="flex items-center">
                        <span className="mr-2">
                          <MetricIcon metric="count" size={18} />
                        </span>
                        Count
                      </span>
                    </SelectItem>
                    <SelectItem value="time">
                      <span className="flex items-center">
                        <span className="mr-2">
                          <MetricIcon metric="time" size={18} />
                        </span>
                        Time
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select> */}

                  <Label>Measurement Unit</Label>
                  {editId === null && (
                    <FormDescription className="text-xs">
                      Choose the unit that best measures your action (what
                      you'll count or track each day)
                    </FormDescription>
                  )}
                  <FormControl>
                    <Input
                      placeholder="e.g., repetitions, pages, minutes"
                      value={actionForm.actionUnit}
                      onChange={(e) => {
                        setActionForm({
                          ...actionForm,
                          actionUnit: e.target.value,
                        });
                        setInputError(false);
                      }}
                      className={`mt-2 mb-8 text-base ${
                        inputError ? "border-destructive" : ""
                      }`}
                    />
                  </FormControl>

                  <div className="flex items-center mt-2 mb-4">
                    <Label className="mr-4">
                      Daily{" "}
                      {actionForm.type === "offensive" ? "Target" : "Limit"}:
                    </Label>

                    <MetricIcon metric={actionForm.metric} size={20} />
                    <div className="ml-1">{actionForm.dailyTarget}</div>
                  </div>

                  <Slider
                    value={[actionForm.dailyTarget]} // the value should be passed as an array
                    max={10}
                    onValueChange={(
                      value // `value` will be an array, so we grab the first element
                    ) =>
                      setActionForm({
                        ...actionForm,
                        dailyTarget: Number(value[0]) || 1, // access the first item from the array
                      })
                    }
                    className="w-full my-8 mb-10"
                  />
                  <Button onClick={handleActionSubmit} className="w-full mb-4">
                    {editId !== null ? "Edit Action" : "Add Action"}
                  </Button>
                  <DrawerClose asChild className="w-full mb-4">
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
