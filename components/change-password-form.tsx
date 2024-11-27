"use client";

import { resetPasswordAction } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { useEffect } from "react";

export default function ChangePasswordForm() {
  const [state, formAction] = useFormState(resetPasswordAction, {
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <form
      action={formAction}
      className="mt-10 mx-auto flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4"
    >
      <h1 className="text-2xl font-medium">Change password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />

      <SubmitButton>Reset password</SubmitButton>
    </form>
  );
}
