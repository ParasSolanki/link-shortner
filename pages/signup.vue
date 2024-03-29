<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { toast } from "vue-sonner";
import { Loader2 } from "lucide-vue-next";

const user = useUser();
if (user.value) {
  await navigateTo("/"); // redirect to profile page
}

useHead({
  title: "SignUp | Link Shortner",
});

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string(),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const { mutate, isPending } = useMutation(
  (data) =>
    $fetch("/api/signup", {
      method: "POST",
      body: data,
    }),
  {
    onSuccess: () => {
      navigateTo("/");
      toast.success("Account created Successfully");
    },
    onError: (error) => {
      toast.error(error?.data?.message ?? "Something went wrong");
    },
  }
);

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData();

  formData.append("email", values.email);
  formData.append("password", values.password);
  mutate(formData);
});
</script>

<template>
  <main class="h-screen flex">
    <div
      class="hidden h-screen w-6/12 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-900 lg:block"
    >
      <div class="mx-auto py-20 max-w-xl px-2">
        <h1 class="px-2 text-5xl font-bold text-white">Create An Account</h1>
      </div>
    </div>
    <div class="relative w-full lg:w-6/12">
      <div class="bg-grid absolute inset-0"></div>
      <div class="relative flex h-full items-center">
        <NuxtLink
          to="/"
          class="absolute top-4 right-4 font-bold text-primary underline underline-offset-4 hover:opacity-80"
        >
          Home
        </NuxtLink>
        <div class="mx-auto w-full max-w-xl space-y-4 px-4">
          <h3 class="text-4xl font-black text-foreground">Sign Up</h3>
          <p class="text-muted-foreground">
            Enter your email below to create your account
          </p>

          <form @submit="onSubmit">
            <fieldset class="space-y-4" :disabled="isPending">
              <div>
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div>
                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter password"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <Button type="submit" :disabled="isPending">
                <Loader2 v-if="isPending" class="mr-1 h-4 w-4 animate-spin" />
                Sign Up
              </Button>
            </fieldset>
          </form>

          <p class="mt-4 text-muted-foreground">
            Already have an account?
            <NuxtLink
              to="/signin"
              class="font-bold text-primary underline underline-offset-4 hover:opacity-80"
            >
              Sign In
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
