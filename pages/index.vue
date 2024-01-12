<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useMutation } from "~/composables/use-mutation";
import { toast } from "vue-sonner";
import { Loader2, Clipboard, ClipboardCheck } from "lucide-vue-next";

definePageMeta({
  layout: "app",
});

useHead({
  title: "Link Shortner",
});

const BASE_URL = "http://localhost:3000";

const formSchema = toTypedSchema(
  z.object({
    href: z.string().url(),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});

const { mutate, isPending, data } = useMutation(
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

const copied = ref(false);

function handleCopyLink(link: string) {
  window.navigator.clipboard.writeText(link);
  copied.value = true;
  toast.success("Link copied");

  setTimeout(() => {
    copied.value = false;
  }, 1000);
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-20">
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

        <div v-if="data" class="mt-10 space-y-4">
          <div>
            <h3 class="text-2xl font-bold">Your shortened Link</h3>
            <p class="text-muted-foreground text-sm">
              Copy the short link and share it in messages, texts, posts,
              websites and other locations.
            </p>
          </div>

          <div class="relative">
            <Input
              readonly
              class="pr-12"
              :default-value="`${BASE_URL}/${data.link.slug}`"
            />

            <div class="absolute top-1/2 right-0.5 -translate-y-1/2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      @click="handleCopyLink(`${BASE_URL}/${data.link.slug}`)"
                    >
                      <Clipboard v-if="!copied" class="h-4 w-4" />
                      <ClipboardCheck v-else class="h-4 w-4 text-green-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {{ copied ? "Copied" : "Copy" }}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div class="flex space-x-2">
            <span class="flex-shrink-0">Long Link:</span>
            <NuxtLink
              target="_blank"
              :to="data.link.href"
              rel="noreferrer noopener"
              class="underline underline-offset-4 font-bold text-primary hover:opacity-80"
              >{{ data.link.href }}</NuxtLink
            >
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
