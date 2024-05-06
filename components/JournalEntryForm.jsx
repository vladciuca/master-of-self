"use client";

import * as z from "zod";
import { useState } from "react";
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

const formSchema = z.object({
  dailyGratefulItems: z.array(z.string()),
});

const JournalEntryForm = ({ submitting, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dailyGratefulItems: [],
    },
  });
  const [gratefulItems, setGratefulItems] = useState([]);

  const addGratefulItem = () => {
    const currentValue = form.getValues("gratefulItem");
    if (currentValue) {
      setGratefulItems((prevItems) => [...prevItems, currentValue]);
      form.setValue("gratefulItem", "");
    }
  };

  const handleSubmit = () => {
    onSubmit(gratefulItems);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="gratefulItem"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Things I am grateful for...</FormLabel>
                <FormControl>
                  <Input
                    className="text-base"
                    placeholder="What are you feeling grateful for?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="button" className="1/2" onClick={addGratefulItem}>
          Add
        </Button>
        <ul>
          {gratefulItems.map((item, index) => (
            <li key={index}>{item}</li> // Display the list of grateful items
          ))}
        </ul>
        <div className="flex flex-col justify-center items-center">
          <Button type="submit" disabled={submitting} className="w-1/2 mt-3">
            Submit
          </Button>
          <Link href="/habits" className="w-full flex justify-center my-6">
            <Button variant="secondary" className="w-1/2">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default JournalEntryForm;
