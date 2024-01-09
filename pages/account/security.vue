<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

useHead({
  title: "Security | Link Shortner",
});

const formSchema = toTypedSchema(
  z.object({
    oldPassword: z
      .string()
      .min(8, "Old password must contain at least 8 character(s)")
      .max(256, "Old password must contain at most 256 character(s)"),
    newPassword: z
      .string()
      .min(8, "New password must contain at least 8 character(s)")
      .max(256, "New password must contain at most 256 character(s)"),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    oldPassword: "",
    newPassword: "",
  },
});

const { mutate, isPending } = useMutation(
  (data) =>
    $fetch("/api/me/change-password", {
      method: "PATCH",
      body: data,
    }),
  {
    onSuccess: (data) => {
      if (!data.ok) return;
      toast.success("Password updated");
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.data?.message ?? "Something went wrong");
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate(values);
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-primary text-3xl font-semibold">Security</h3>
      <p class="text-muted-foreground">Update your account settings.</p>
    </div>
    <Separator />

    <form @submit="onSubmit">
      <fieldset :disabled="isPending">
        <Card class="overflow-hidden">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent class="sm:flex space-y-4 sm:space-y-0 sm:space-x-6">
            <FormField v-slot="{ componentField }" name="oldPassword">
              <FormItem class="w-full sm:w-6/12 md:w-4/12">
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter old password"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="newPassword">
              <FormItem class="w-full sm:w-6/12 md:w-4/12">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter new password"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter
            class="flex items-center justify-between border-t py-4 bg-primary-foreground space-x-3"
          >
            <p class="text-base text-muted-foreground">
              Password does require minimum 8 and maximum 256 characters.
            </p>
            <Button type="submit" size="sm" :disabled="isPending">
              <Loader2 v-if="isPending" class="mr-1 h-4 w-4 animate-spin" />
              Save
            </Button>
          </CardFooter>
        </Card>
      </fieldset>
    </form>
  </div>
</template>
