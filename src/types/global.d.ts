export {};

declare global {
  interface FormData {
    get(name: string): File | string | null;
    getAll(name: string): (File | string)[];
    has(name: string): boolean;
    append(name: string, value: string | Blob, fileName?: string): void;
    delete(name: string): void;
    set(name: string, value: string | Blob, fileName?: string): void;
  }
}
