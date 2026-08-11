import * as Avatar from "@solidiom/avatar"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    users: Array<{ initials: string; name: string }>
  }
> = {
  en: {
    users: [
      { initials: "JD", name: "Jane Doe" },
      { initials: "AS", name: "Alice Smith" },
      { initials: "BK", name: "Bob Kim" },
    ],
  },
  es: {
    users: [
      { initials: "JD", name: "Jane Doe" },
      { initials: "AS", name: "Alice Smith" },
      { initials: "BK", name: "Bob Kim" },
    ],
  },
}

export interface AvatarExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Avatar documentation example.
 * Shows avatars with image fallback to initials in a stacked layout.
 */
export function AvatarExample(props: AvatarExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="avatar-example"
      data-avatar-example
    >
      <div class="avatar-example__stack">
        {copy().users.map((user) => (
          <Avatar.Root>
            <Avatar.Image
              src={`/avatars/${user.name.toLowerCase().replace(" ", "-")}.jpg`}
              alt={`Photo of ${user.name}`}
            />
            <Avatar.Fallback>{user.initials}</Avatar.Fallback>
          </Avatar.Root>
        ))}
      </div>
    </div>
  )
}
