<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

definePageMeta({
  middleware: ["protected"],
});

const formSchema = toTypedSchema(
  z.object({
    link: z.string().url(),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

useHead({
  title: "Link Shortner",
});

definePageMeta({
  layout: "app",
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
          <fieldset>
            <div>
              <FormField v-slot="{ componentField }" name="link">
                <FormItem>
                  <FormLabel class="uppercase">Link</FormLabel>
                  <div class="flex items-center space-x-4">
                    <FormControl>
                      <Input placeholder="Enter link" v-bind="componentField" />
                    </FormControl>
                    <Button type="submit" class="shrink-0">Shorten Link</Button>
                  </div>
                  <FormDescription>
                    Link shortener allows to create a shortened link making it
                    easy to share.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
