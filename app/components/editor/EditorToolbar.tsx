"use client";

import * as Toolbar from "@radix-ui/react-toolbar";

interface Action {
  key: string;
  label: string;
}

interface EditorToolbarProps {
  actions: Action[];
  onAction: (key: string) => void;
}

export function EditorToolbar({ actions, onAction }: EditorToolbarProps) {
  const btn =
    "px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <Toolbar.Root className="flex flex-wrap gap-2 border-b pb-3 mb-4">
      {actions.map((action) => (
        <Toolbar.Button
          key={action.key}
          className={btn}
          onClick={() => onAction(action.key)}
        >
          {action.label}
        </Toolbar.Button>
      ))}
    </Toolbar.Root>
  );
}
