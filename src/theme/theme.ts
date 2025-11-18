import {
  createSystem,
  defineConfig,
  defineRecipe,
  defaultConfig,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  className: "chakra-button", // mantém compatibilidade
  base: {
    borderRadius: "full",
    fontWeight: "semibold",
  },
  variants: {
    variant: {
      solid: {
        bg: "#000000",
        color: "white",
        border: "1px solid white",
        _hover: {
          bg: "white",
          color: "#000000",
          border: "1px solid #000000",
          _dark: {
            bg: "#000000",
            color: "#FFFFFF",
            border: "1px solid #FFFFFF",
          },
        },
        _dark: { bg: "#FFFFFF", color: "#000000", border: "1px solid #000000" },
      },
      outline: {
        border: "1px solid",
        borderColor: "#000000",
        color: "#000000",
        bg: "transparent",
        _hover: {
          bg: "#000000",
          color: "white",
          _dark: {
            bg: "white",
            color: "#000000",
            border: "1px solid #000000",
          },
        },
        _dark: { bg: "transparent", color: "#FFFFFF", border: "1px solid" },
      },
    },
    size: {
      xl: {
        fontSize: "lg",
        px: 6,
        py: 3,
      },
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: "var(--font-montserrat), sans-serif" },
        heading: { value: "var(--font-montserrat), sans-serif" },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
