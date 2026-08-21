/**
 * Opening a project should feel like the tile becoming the page, not like a
 * document being replaced.
 *
 * The clicked frame is cloned, lifted out of the layout and expanded to fill
 * the viewport while the project name rises through it. Navigation happens
 * underneath that cover, so the new page is already there when it clears.
 *
 * Anyone with reduced motion turned on simply navigates.
 */

export function openProject(frame: HTMLElement, name: string, accent: string, go: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    go();
    return;
  }

  const rect = frame.getBoundingClientRect();

  const curtain = document.createElement("div");
  curtain.setAttribute("aria-hidden", "true");
  Object.assign(curtain.style, {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: "140",
    overflow: "hidden",
    background: "var(--bg-sunk)",
    willChange: "transform, width, height, top, left",
    transition:
      "left 0.62s var(--ease-snap), top 0.62s var(--ease-snap), width 0.62s var(--ease-snap), height 0.62s var(--ease-snap)",
  });

  // The artwork travels with it.
  curtain.innerHTML = frame.innerHTML;

  // The name arrives through the image, in the project's own accent.
  const label = document.createElement("span");
  label.textContent = name.toLowerCase();
  Object.assign(label.style, {
    position: "absolute",
    inset: "0",
    display: "grid",
    placeItems: "center",
    fontFamily: "var(--font-grotesk)",
    fontSize: "clamp(2rem, 8vw, 6rem)",
    fontVariationSettings: '"wght" 700, "wdth" 100',
    letterSpacing: "-0.03em",
    color: accent,
    opacity: "0",
    transform: "translateY(18px)",
    transition: "opacity 0.4s linear 0.16s, transform 0.7s var(--ease-out) 0.16s",
  });
  curtain.appendChild(label);

  document.body.appendChild(curtain);

  // Force the browser to resolve the starting geometry before changing it.
  // Without this flush the two states land in the same style recalculation and
  // the curtain jumps straight to full screen instead of expanding.
  void curtain.getBoundingClientRect();

  curtain.style.left = "0px";
  curtain.style.top = "0px";
  curtain.style.width = "100vw";
  curtain.style.height = "100vh";
  label.style.opacity = "1";
  label.style.transform = "translateY(0)";

  // Navigate while the cover is closing, so the page is ready behind it.
  window.setTimeout(go, 380);

  window.setTimeout(() => {
    curtain.style.transition = "opacity 0.45s var(--ease-out)";
    curtain.style.opacity = "0";
    window.setTimeout(() => curtain.remove(), 500);
  }, 900);
}
