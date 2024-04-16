import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const resizeHandleClasses = {
  bottom: "handle long-handle-horizontal bottom-handle",
  bottomLeft: "handle left-handle bottom-handle",
  bottomRight: "handle right-handle bottom-handle",
  left: "handle long-handle left-handle",
  right: "handle long-handle right-handle",
  top: "handle long-handle-horizontal top-handle",
  topLeft: "handle left-handle top-handle",
  topRight: "handle right-handle top-handle"
};

export function getCircularReplacer(this: any) {
  const ancestors: any[] = [];
  return (key: any, value: null) => {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return "[Circular]";
    }
    ancestors.push(value);
    return value;
  };
}

export const logSubmit = async (data: any) => {
  try {
    return await fetch('/api/logger', {
      method: 'POST',
      body: data,
    }).then((dataRes) => dataRes.json());
  } catch (error) {
    console.error('Error:', error);
    return error
  }
};