"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconPicker from "@components/IconPicker";

const formSchema = z.object({
  skillName: z.string().min(3),
  skillIcon: z.string(),
  skillDescription: z.string(),
  skillTag: z.enum(["mind", "body", "spirit"]).optional(),
});

const SkillForm = ({ type, submitting, onSubmit, habit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillName: type === "Edit" ? habit.name : "",
      skillIcon: type === "Edit" ? habit.icon : "",
      skillDescription: type === "Edit" ? habit.description : "",
      skillTag: type === "Create" ? "" : undefined,
    },
  });

  const handleIconSelect = (iconId) => {
    form.setValue("skillIcon", iconId);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full flex flex-col space-y-8"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {type} Habit
        </h1>
        <div>
          <div className="mb-1">
            <FormLabel>Habit icon</FormLabel>
          </div>
          <IconPicker onIconSelect={handleIconSelect} skillIcon={habit?.icon} />
        </div>

        <FormField
          control={form.control}
          name="skillName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Habit name</FormLabel>
                <FormControl>
                  <Input
                    className="text-base"
                    placeholder="What habit can aid you in jour journey?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {type === "Create" && (
          <FormField
            control={form.control}
            name="skillTag"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Habit category</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mind">Mind</SelectItem>
                      <SelectItem value="body">Body</SelectItem>
                      <SelectItem value="spirit">Spirit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={form.control}
          name="skillDescription"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Habit description</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-base"
                    placeholder="How can this habit aid you in jour journey?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex flex-col justify-center items-center">
          <Button type="submit" disabled={submitting} className="w-1/2 mt-3">
            {type} Habit
          </Button>
          <Link href="/habits" className="w-full flex justify-center my-6">
            <Button variant="secondary" className="w-1/2">
              Cancel
            </Button>
          </Link>
          {/* {type === "Edit" && (
            <Button variant="destructive" className="w-1/2 rounded-full mt-6">
              Delete Habit
            </Button>
          )} */}
        </div>
      </form>
    </Form>
  );
};

export default SkillForm;
