<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useMutation } from "~/composables/use-mutation";
import { toast } from "vue-sonner";
import { Loader2 } from "lucide-vue-next";

definePageMeta({
  middleware: ["protected"],
});

definePageMeta({
  layout: "app",
});

useHead({
  title: "Link Shortner",
});

const formSchema = toTypedSchema(
  z.object({
    href: z.string().url(),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});

const { mutate, isPending } = useMutation(
  (data) =>
    $fetch("/api/link", {
      method: "POST",
      body: data,
    }),
  {
    onSuccess: () => {
      toast.success("Short link created Successfully");
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
  <div class="max-w-3xl mx-auto px-4 py-8">
    <Card>
      <CardHeader>
        <CardTitle class="text-3xl md:text-4xl lg:text-5xl font-black"
          >Paste the link to be shortened</CardTitle
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <fieldset :disabled="isPending">
            <FormField v-slot="{ componentField }" name="href">
              <FormItem>
                <FormLabel class="uppercase">Link</FormLabel>
                <div class="flex items-center space-x-4">
                  <FormControl>
                    <Input placeholder="Enter link" v-bind="componentField" />
                  </FormControl>
                  <Button type="submit" class="shrink-0" :disabled="isPending">
                    <Loader2
                      v-if="isPending"
                      class="mr-1 h-4 w-4 animate-spin"
                    />

                    Shorten Link
                  </Button>
                </div>
                <FormDescription>
                  Link shortener allows to create a shortened link making it
                  easy to share.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
