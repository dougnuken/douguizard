import type { ComponentType } from "react";
import VignetteOlbo from "./VignetteOlbo";
import VignetteNaowee from "./VignetteNaowee";
import VignetteMercadolibre from "./VignetteMercadolibre";
import VignetteBanco from "./VignetteBanco";
import VignetteDc from "./VignetteDc";
import type { VignetteProps } from "./VignetteFrame";

/** The dictionary key a vignette's caption and label live under (`work.vignettes`). */
export type VignetteKey = "olbo" | "naowee" | "andes" | "banco" | "dc";

/**
 * The cases that carry a live vignette, by slug. Captions and labels are
 * words, so they come from the dictionary under the same key.
 *
 * Shared by the home index, which shows one beside each featured row, and the
 * case page, which leads with it when the case has no screens of its own to
 * show — so a confidential case still opens on something to look at.
 */
export const VIGNETTES: Record<string, { Component: ComponentType<VignetteProps>; key: VignetteKey }> = {
  olbo: { Component: VignetteOlbo, key: "olbo" },
  "naowee-suid": { Component: VignetteNaowee, key: "naowee" },
  "mercadolibre-andes": { Component: VignetteMercadolibre, key: "andes" },
  "banco-de-occidente": { Component: VignetteBanco, key: "banco" },
  "dc-medical": { Component: VignetteDc, key: "dc" },
};
