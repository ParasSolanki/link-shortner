export type Mode = "light" | "dark" | "system";
export type ColorModePreference = "light" | "dark";

export type ColorMode = {
  mode: Mode;
  preference: ColorModePreference;
  unknown: boolean;
};

const PERFERS_COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";

export function useColorMode() {
  const colorMode = useState<ColorMode>("colorMode", () => ({
    mode: "system",
    preference: "light",
    unknown: true,
  }));
  const colorModeCookie = useCookie("link-shortner-color-mode", {
    default: () => ({}),
    watch: true,
  });
  const matchMediaRef = ref<MediaQueryList>();

  // update and sync cookie with the colorMode state
  Object.assign(colorMode.value, colorModeCookie.value);

  watch(colorMode, (value) => {
    colorModeCookie.value = { ...value };
  });

  function handleChangeMode(mode: Mode, preference: ColorModePreference) {
    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add("no-transitions");

    colorMode.value = {
      mode,
      preference,
      unknown: false,
    };

    if (preference === "dark") document.documentElement.classList.add("dark");
    if (preference === "light") document.documentElement.classList.add("light");

    setTimeout(() => {
      document.documentElement.classList.remove("no-transitions");
    });
  }

  function watchMedia(e: MediaQueryListEvent) {
    handleChangeMode("system", e.matches ? "dark" : "light");
  }

  function changeColorMode(mode: ColorMode["mode"]) {
    if (matchMediaRef.value) {
      matchMediaRef.value.removeEventListener("change", watchMedia);
      matchMediaRef.value = undefined;
    }

    let preference: ColorModePreference = "light";

    if (mode === "light") preference = "light";
    else if (mode === "dark") preference = "dark";
    else {
      matchMediaRef.value = window.matchMedia(PERFERS_COLOR_SCHEME_DARK);
      preference = matchMediaRef.value.matches ? "dark" : "light";
      matchMediaRef.value.addEventListener("change", watchMedia);
    }

    handleChangeMode(mode, preference);
  }

  onMounted(() => {
    if (import.meta.server) return;

    if (colorMode.value.unknown && colorMode.value.mode === "system") {
      const preference = window.matchMedia(PERFERS_COLOR_SCHEME_DARK).matches
        ? "dark"
        : "light";

      colorMode.value = {
        mode: "system",
        preference,
        unknown: false,
      };
    }

    if (colorMode.value.mode === "system") {
      matchMediaRef.value = window.matchMedia(PERFERS_COLOR_SCHEME_DARK);

      matchMediaRef.value.addEventListener("change", watchMedia);
    }
  });

  return { colorMode, changeColorMode };
}
