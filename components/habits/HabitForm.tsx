"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconPicker } from "@/components/IconPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useIconRarityLevel } from "@/hooks/useIconRarityLevel";
import {
  CircleX,
  Plus,
  CircleAlert,
  TriangleAlert,
  OctagonAlert,
  ShieldAlert,
  Hash,
  Clock,
} from "lucide-react";
import { Label } from "@components/ui/label";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Habit name must contain at least 3 characters")
    .max(25, "Habit name must contain maximum 25 characters"),
  icon: z.string().min(1, "Please select an icon"),
  description: z.string().min(3, "Please add a habit description"),
  xp: z.number().optional(),
  actions: z
    .array(
      z.object({
        action: z.string(),
        type: z.enum(["offensive", "defensive", "balanced"]),
        metric: z.enum(["count", "time"]),
        value: z.number().default(0),
      })
    )
    .min(1, "Please add a habit action"),
});

export type HabitZodType = z.infer<typeof formSchema>;

type HabitFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: HabitZodType) => Promise<void>;
  habit?: HabitZodType;
};

export function HabitForm({
  type,
  submitting,
  onSubmit,
  habit,
}: HabitFormProps) {
  const [newAction, setNewAction] = useState<{
    action: string;
    metric: "count" | "time";
    type: "offensive" | "defensive" | "balanced";
  }>({
    action: "",
    metric: "count",
    type: "balanced",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<HabitZodType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "Update" ? habit?.name : "",
      icon: type === "Update" ? habit?.icon : "",
      description: type === "Update" ? habit?.description : "",
      xp: type === "Update" ? habit?.xp : 0,
      actions: type === "Update" ? habit?.actions || [] : [],
    },
  });

  const { iconColorClass, bgColorClass } = useIconRarityLevel(form.watch("xp"));

  const addAction = () => {
    if (newAction.action !== "") {
      const currentActions = form.watch("actions");
      form.setValue("actions", [...currentActions, { ...newAction, value: 0 }]);
      setNewAction({ action: "", metric: "count", type: "balanced" });
      setIsDrawerOpen(false);
    }
  };

  const removeAction = (index: number) => {
    const updatedActions = form.watch("actions").filter((_, i) => i !== index);
    form.setValue("actions", updatedActions);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 h-full justify-between"
      >
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-4">
          {type} Habit
        </h1>

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Icon</FormLabel>
              <FormControl>
                <IconPicker
                  value={field.value}
                  onChange={(iconName) => field.onChange(iconName)}
                  iconColorClass={iconColorClass}
                  bgColorClass={bgColorClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit name</FormLabel>
              <FormControl>
                <Input
                  className="text-base"
                  placeholder="A consistent action you can take to improve..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit description</FormLabel>
              <FormControl>
                <Textarea
                  className="text-base"
                  placeholder="How can this action help you achieve your goals?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="actions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actions</FormLabel>

              <div className="flex flex-col gap-2">
                {field.value.map((action, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="text flex justify-between items-center border-b pb-1 mb-2">
                      <div className="flex items-center">
                        {action.type === "offensive" ? (
                          <TriangleAlert
                            className="mr-2 text-blue-500"
                            size={20}
                          />
                        ) : action.type === "defensive" ? (
                          <OctagonAlert
                            className="mr-2 text-blue-500"
                            size={20}
                          />
                        ) : (
                          <CircleAlert
                            className="mr-2 text-blue-500"
                            size={20}
                          />
                        )}
                        {action.action}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="ml-2 text-red-500"
                        aria-label={`Remove action ${action.action}`}
                      >
                        <CircleX size={20} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary">
                        {action.type === "defensive"
                          ? "I won't"
                          : action.type === "offensive"
                          ? "I want"
                          : "I will"}
                      </Badge>
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
                  </div>
                ))}
              </div>
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Action
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-md mx-auto left-0 right-0">
                  <DrawerHeader>
                    <DrawerTitle>Add New Action</DrawerTitle>
                    <div className="w-full flex justify-center mt-2">
                      {newAction.type === "offensive" ? (
                        <TriangleAlert className="text-blue-500" size={40} />
                      ) : newAction.type === "defensive" ? (
                        <OctagonAlert className="text-blue-500" size={40} />
                      ) : (
                        <CircleAlert className="text-blue-500" size={40} />
                      )}
                    </div>
                    <div className="w-full flex justify-center mt-1">
                      <Badge variant="secondary" className="text-sm">
                        {newAction.type === "defensive"
                          ? "I won't"
                          : newAction.type === "offensive"
                          ? "I want"
                          : "I will"}
                      </Badge>
                    </div>
                  </DrawerHeader>

                  <div className="p-4 pb-0">
                    <FormControl>
                      <Input
                        value={newAction.action}
                        onChange={(e) =>
                          setNewAction({ ...newAction, action: e.target.value })
                        }
                        placeholder="Enter new action"
                        className="mb-8 text-base"
                      />
                    </FormControl>

                    <Label className="flex items-center space-x-2">
                      <span>Action type</span>
                      <span>
                        {newAction.type === "offensive" ? (
                          <TriangleAlert className="text-blue-500" size={20} />
                        ) : newAction.type === "defensive" ? (
                          <OctagonAlert className="text-blue-500" size={20} />
                        ) : (
                          <CircleAlert className="text-blue-500" size={20} />
                        )}
                      </span>
                      <span>
                        <Badge variant="secondary" className="text-xs">
                          {newAction.type === "defensive"
                            ? "I won't"
                            : newAction.type === "offensive"
                            ? "I want"
                            : "I will"}
                        </Badge>
                      </span>
                    </Label>
                    <Select
                      value={newAction.type}
                      onValueChange={(
                        value: "offensive" | "defensive" | "balanced"
                      ) => setNewAction({ ...newAction, type: value })}
                    >
                      <SelectTrigger className="my-4 mb-8">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="offensive">Offensive</SelectItem>
                        <SelectItem value="defensive">Defensive</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label className="flex items-center space-x-2">
                      <span>Action tracking metric</span>
                      <Badge variant="outline" className="capitalize">
                        {newAction.metric === "count" ? (
                          <Hash size={18} className="mr-2" />
                        ) : (
                          <Clock size={18} className="mr-2" />
                        )}
                        {newAction.metric}
                      </Badge>
                    </Label>
                    <Select
                      value={newAction.metric}
                      onValueChange={(value: "count" | "time") =>
                        setNewAction({ ...newAction, metric: value })
                      }
                    >
                      <SelectTrigger className="mt-4 mb-24">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="time">Time</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button onClick={addAction} className="w-full mb-4">
                      Add Action
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col justify-center items-center flex-grow">
          <Button type="submit" disabled={submitting} className="w-1/2 mt-3">
            {type} Habit
          </Button>
          <Link href="/habits" className="w-full flex justify-center my-8">
            <Button variant="secondary" className="w-1/2">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
