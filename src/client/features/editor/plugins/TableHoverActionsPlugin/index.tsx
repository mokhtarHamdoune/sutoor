/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from "react";

import "./index.css";

import {
  autoUpdate,
  offset,
  shift,
  useFloating,
  type VirtualElement,
} from "@floating-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import {
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
} from "@lexical/table";
import {
  $getNearestNodeFromDOMNode,
  type EditorThemeClasses,
  isHTMLElement,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { getThemeSelector } from "../../utils/getThemeSelector";
import {
  Ellipsis,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/shared/ui/dropdown-menu";

const INDICATOR_SIZE_PX = 18;
const SIDE_INDICATOR_SIZE_PX = 18;
const TOP_BUTTON_OVERHANG = INDICATOR_SIZE_PX / 2;
const LEFT_BUTTON_OVERHANG = SIDE_INDICATOR_SIZE_PX / 2;

function getTableFromMouseEvent(
  event: MouseEvent,
  getTheme: () => EditorThemeClasses | null | undefined
): {
  isOutside: boolean;
  tableElement: HTMLTableElement | null;
} {
  if (!isHTMLElement(event.target)) {
    return { isOutside: true, tableElement: null };
  }

  const cellSelector = `td${getThemeSelector(
    getTheme,
    "tableCell"
  )}, th${getThemeSelector(getTheme, "tableCell")}`;
  const cell = event.target.closest<HTMLTableCellElement>(cellSelector);
  const tableElement = cell?.closest<HTMLTableElement>("table") ?? null;

  return {
    isOutside: tableElement == null,
    tableElement,
  };
}

function getClosestTopCellPosition(
  tableElement: HTMLTableElement,
  clientX: number
): { centerX: number; top: number; cell: HTMLTableCellElement } | null {
  const firstRow = tableElement.rows[0];
  if (!firstRow) {
    return null;
  }

  let closest: {
    cell: HTMLTableCellElement;
    centerX: number;
    top: number;
  } | null = null;
  let smallestDelta = Number.POSITIVE_INFINITY;

  for (const cell of Array.from(firstRow.cells)) {
    const rect = cell.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const delta = Math.abs(centerX - clientX);
    if (delta < smallestDelta) {
      smallestDelta = delta;
      closest = { cell, centerX, top: rect.top };
    }
  }

  return closest;
}

function TableHoverActionsV2({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element | null {
  const [editor, { getTheme }] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const virtualRef = useRef<VirtualElement>({
    getBoundingClientRect: () => new DOMRect(),
  });
  const leftVirtualRef = useRef<VirtualElement>({
    getBoundingClientRect: () => new DOMRect(),
  });
  const floatingElemRef = useRef<HTMLElement | null>(null);
  const leftFloatingElemRef = useRef<HTMLElement | null>(null);
  const hoveredLeftCellRef = useRef<HTMLTableCellElement | null>(null);
  const hoveredTopCellRef = useRef<HTMLTableCellElement | null>(null);
  const handleMouseLeaveRef = useRef<((event: MouseEvent) => void) | null>(
    null
  );

  const { refs, floatingStyles, update } = useFloating({
    elements: {
      reference: virtualRef.current as unknown as Element,
    },
    middleware: [
      offset({ mainAxis: -TOP_BUTTON_OVERHANG }),
      shift({
        padding: 8,
      }),
    ],
    placement: "top",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });

  const {
    refs: leftRefs,
    floatingStyles: leftFloatingStyles,
    update: updateLeft,
  } = useFloating({
    elements: {
      reference: leftVirtualRef.current as unknown as Element,
    },
    middleware: [
      offset({ mainAxis: -LEFT_BUTTON_OVERHANG }),
      shift({
        padding: 8,
      }),
    ],
    placement: "left",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!isEditable) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (
        (floatingElemRef.current &&
          event.target instanceof Node &&
          floatingElemRef.current.contains(event.target)) ||
        (leftFloatingElemRef.current &&
          event.target instanceof Node &&
          leftFloatingElemRef.current.contains(event.target))
      ) {
        return;
      }

      const { tableElement, isOutside } = getTableFromMouseEvent(
        event,
        getTheme
      );

      if (
        isOutside ||
        tableElement == null ||
        (anchorElem && !anchorElem.contains(tableElement))
      ) {
        setIsVisible(false);
        setIsLeftVisible(false);
        return;
      }

      const cellSelector = `td${getThemeSelector(
        getTheme,
        "tableCell"
      )}, th${getThemeSelector(getTheme, "tableCell")}`;
      const hoveredCell = isHTMLElement(event.target)
        ? event.target.closest<HTMLTableCellElement>(cellSelector)
        : null;

      if (!hoveredCell) {
        setIsVisible(false);
        setIsLeftVisible(false);
        hoveredTopCellRef.current = null;
        hoveredLeftCellRef.current = null;
        return;
      }

      const rowIndex =
        hoveredCell.parentElement instanceof HTMLTableRowElement
          ? hoveredCell.parentElement.rowIndex
          : -1;
      const colIndex = hoveredCell.cellIndex ?? -1;

      const closestTopCell = getClosestTopCellPosition(
        tableElement,
        event.clientX
      );

      if (!closestTopCell || rowIndex !== 0) {
        setIsVisible(false);
        hoveredTopCellRef.current = null;
      } else {
        hoveredTopCellRef.current = closestTopCell.cell;
        virtualRef.current.getBoundingClientRect = () =>
          new DOMRect(closestTopCell.centerX, closestTopCell.top, 0, 0);
        refs.setReference(virtualRef.current as unknown as Element);
        setIsVisible(true);
        update?.();
      }

      const tableRect = tableElement.getBoundingClientRect();
      if (colIndex !== 0) {
        setIsLeftVisible(false);
        hoveredLeftCellRef.current = null;
      } else {
        const { top, height } = hoveredCell.getBoundingClientRect();
        const centerY = top + height / 2;
        hoveredLeftCellRef.current = hoveredCell;
        leftVirtualRef.current.getBoundingClientRect = () =>
          new DOMRect(tableRect.left, centerY, 0, 0);
        leftRefs.setReference(leftVirtualRef.current as unknown as Element);
        setIsLeftVisible(true);
        updateLeft?.();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      setIsVisible(false);
      setIsLeftVisible(false);
    };
  }, [anchorElem, getTheme, isEditable, leftRefs, refs, update, updateLeft]);

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget;
      if (
        nextTarget &&
        floatingElemRef.current &&
        floatingElemRef.current.contains(nextTarget as Node)
      ) {
        return;
      }
      if (
        nextTarget &&
        leftFloatingElemRef.current &&
        leftFloatingElemRef.current.contains(nextTarget as Node)
      ) {
        return;
      }
      setIsVisible(false);
      setIsLeftVisible(false);
    };
    handleMouseLeaveRef.current = handleMouseLeave;

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement && handleMouseLeaveRef.current) {
        prevRootElement.removeEventListener(
          "mouseleave",
          handleMouseLeaveRef.current
        );
      }
      if (rootElement && handleMouseLeaveRef.current) {
        rootElement.addEventListener("mouseleave", handleMouseLeaveRef.current);
      }
    });
  }, [editor]);

  if (!isEditable) {
    return null;
  }

  const handleAddColumn = (insertAfter?: boolean) => {
    const targetCell = hoveredTopCellRef.current;
    if (!targetCell) {
      return;
    }
    editor.update(() => {
      const maybeCellNode = $getNearestNodeFromDOMNode(targetCell);
      if ($isTableCellNode(maybeCellNode)) {
        maybeCellNode.selectEnd();
        $insertTableColumnAtSelection(insertAfter);
      }
    });
  };

  const handleAddRow = (insertAfter?: boolean) => {
    const targetCell = hoveredLeftCellRef.current;
    if (!targetCell) {
      return;
    }
    editor.update(() => {
      const maybeCellNode = $getNearestNodeFromDOMNode(targetCell);
      if ($isTableCellNode(maybeCellNode)) {
        maybeCellNode.selectEnd();
        $insertTableRowAtSelection(insertAfter);
      }
    });
  };

  const handleDeleteColumn = () => {
    const targetCell = hoveredTopCellRef.current;
    if (!targetCell) {
      return;
    }
    editor.update(() => {
      const maybeCellNode = $getNearestNodeFromDOMNode(targetCell);
      if ($isTableCellNode(maybeCellNode)) {
        maybeCellNode.selectEnd();
        $deleteTableColumnAtSelection();
      }
    });
  };

  const handleDeleteRow = () => {
    const targetCell = hoveredLeftCellRef.current;
    if (!targetCell) {
      return;
    }
    editor.update(() => {
      const maybeCellNode = $getNearestNodeFromDOMNode(targetCell);
      if ($isTableCellNode(maybeCellNode)) {
        maybeCellNode.selectEnd();
        $deleteTableRowAtSelection();
      }
    });
  };

  return (
    <>
      <div
        ref={(node) => {
          floatingElemRef.current = node;
          refs.setFloating(node);
        }}
        style={{
          ...floatingStyles,
          opacity: isVisible ? 1 : 0,
        }}
        className="floating-top-actions"
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-white cursor-pointer text-gray-400 px-1 border border-gray-400 rounded-sm">
            <Ellipsis size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleAddColumn.bind(null, false)}>
              <MoveLeft /> Insert Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddColumn.bind(null, true)}>
              <MoveRight /> Insert Right
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteColumn}>
              <Trash2 className="text-red-400" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        ref={(node) => {
          leftFloatingElemRef.current = node;
          leftRefs.setFloating(node);
        }}
        style={{
          ...leftFloatingStyles,
          opacity: isLeftVisible ? 1 : 0,
        }}
        className="floating-top-actions"
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-white cursor-pointer text-gray-400  py-1 border border-gray-400 rounded-sm">
            <Ellipsis size={14} className="rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleAddRow.bind(null, false)}>
              <MoveUp /> Insert Above
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddRow.bind(null, true)}>
              <MoveDown /> Insert Below
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteRow}>
              <Trash2 className="text-red-400" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export function TableHoverActionsPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null {
  const isEditable = useLexicalEditable();

  return isEditable
    ? createPortal(<TableHoverActionsV2 anchorElem={anchorElem} />, anchorElem)
    : null;
}
