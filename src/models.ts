export type Options = {
  allowNesting: boolean;
};

export type $onOptions = {
  preventBubbling: boolean;
  once: boolean;
};

export type emittedMetadata = {
  isDirty: boolean;
  originalPropertyName?: string;
};

export type ListenerFn = (
  value?: unknown,
  prop?: string,
  metadata?: emittedMetadata
) => void;

export type LoudObject<T> = T & {
  $isLoud: true;
  $on: (
    prop: string,
    listener: ListenerFn,
    options: Partial<$onOptions>
  ) => void;
  $once: (prop: string, listener: ListenerFn) => void;
  $emit: (prop: string, value: unknown, metadata: emittedMetadata) => void;
  $off: (prop: string, listener: ListenerFn) => void;
  $parent?: LoudObject<any>;
  $propName?: string;
  $listeners: Record<string, ListenerFn[]>;
  $preventBubbling: boolean;
};
