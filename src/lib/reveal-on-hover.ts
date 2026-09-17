/**
 * Classes for a control that stays out of the way until its row is in use.
 *
 * Hover alone is not "in use": a keyboard user tabbing onto the control, a menu the
 * control opened, and a touch screen, which has no hover at all, all need it visible.
 * Only hover was covered before, so keyboard focus landed on invisible buttons and the
 * controls could not be seen on a phone. The same rule as `showOnHover` in `sidebar.tsx`.
 *
 * The row needs the `group` class.
 */
export const revealOnHover =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100";
