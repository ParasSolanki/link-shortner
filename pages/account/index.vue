<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

useHead({
  title: "Account | Link Shortner",
});

const router = useRouter();
const user = useAuthenticatedUser();

const formSchema = toTypedSchema(
  z
    .object({
      displayName: z
        .string({ required_error: "Display name is required" })
        .min(1)
        .max(32),
    })
    .nullable()
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    displayName: user.value.displayName,
  },
});

const { mutate, isPending } = useMutation(
  (data) =>
    $fetch("/api/me/display-name", {
      method: "PATCH",
      body: data,
    }),
  {
    onSuccess: () => {
      toast.success("Display name updated");
      router.go(0);
    },
    onError: (error) => {
      toast.error(error?.data?.message ?? "Something went wrong");
    },
  }
);

const onSubmit = handleSubmit(async (values) => {
  mutate({ displayName: values.displayName });
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-primary text-3xl font-semibold">General</h3>
      <p class="text-muted-foreground">Update your account settings.</p>
    </div>
    <Separator />

    <form @submit="onSubmit">
      <fieldset :disabled="isPending">
        <Card class="overflow-hidden">
          <CardHeader>
            <CardTitle>Display Name</CardTitle>
            <CardDescription
              >Please enter your full name, or a display name you are
              comfortable with.</CardDescription
            >
          </CardHeader>
          <CardContent class="w-96">
            <FormField v-slot="{ componentField }" name="displayName">
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John David"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter
            class="flex items-center justify-between border-t py-4 bg-primary-foreground"
          >
            <p class="text-base text-muted-foreground">
              Please use 32 characters at maximum.
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
