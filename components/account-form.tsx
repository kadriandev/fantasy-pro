"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Form, FormItem, FormField, FormLabel, FormControl } from "./ui/form";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfileAction } from "@/lib/actions/account";
import Link from "next/link";

const formSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
});

type AccountFormProps = {
  user: User;
  profile: {
    full_name: string;
  };
};

export default function AccountForm({ user, profile }: AccountFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { full_name: profile.full_name, email: user.email },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await updateUserProfileAction(values.full_name);
    if (!res.error) {
      toast({ title: "Success", description: "Successfully updated data." });
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was an error trying to update you info.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="eg. John Smith" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
