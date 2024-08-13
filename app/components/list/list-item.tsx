import { tw } from "~/utils/tw";

export interface ListItemData {
  id: string;
  [x: string]: any;
}

export interface ListItemProps {
  item: ListItemData;
  children: React.ReactNode;
  navigate?: (id: string, item: ListItemData) => void;
  className?: string;
  onClick?: (id: string) => void;
}

export const ListItem = ({
  item,
  children,
  navigate,
  className,
  onClick,
}: ListItemProps) => (
  <tr
    // onClick={navigate ? () => navigate(item.id, item) : undefined}
    onClick={(event) => {
      if (navigate) {
        // Check if Ctrl or Cmd key is pressed
        if (window && (event.ctrlKey || event.metaKey)) {
          window.open(window.location.href + "/" + item.id);
          return;
        }

        // Call the navigate function if it exists
        navigate(item.id, item);
      } else onClick && onClick(item.id);
    }}
    className={tw(
      "hover:bg-gray-50",
      navigate ? "cursor-pointer" : "",
      className
    )}
    /**
     * Chromium based browsers have a bug since 2014 that is related to
     * hover effects on table rows while scrolling.
     *  We add the following styles to fix the issue.
     */
    style={{
      transform: "translateZ(0)",
      willChange: "transform",
      backgroundAttachment: "initial",
    }}
  >
    {children}
  </tr>
);
