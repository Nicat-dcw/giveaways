import Storage from "@wumpjs/storage";


declare module "@smootie/emitter" {
  export default class KiwiEmitter<Events extends InterfaceToType<EventMap> = EventMap> {
    /**
     * Create new Kiwi instance.
     */
    public constructor(options?: KiwiOptions);

    /**
     * Kiwi options.
     */
    private options: KiwiOptions;

    /**
     * Events.
     */
    public readonly events: Storage<EventObject[], string>;

    /**
     * Kiwi listener count.
     */
    public readonly listenerCount: number;
    /**
     * Kiwi listener limit.
     */
    public readonly listenerLimit: number;

    /**
     * Listen to the events. Create custom actions for them.
     */
    public on<Key extends keyof Events>(name: Key, fncallback: Events[Key]): this;
    /**
     * Listen to the events once. Create custom actions for them.
     */
    public once<Key extends keyof Events>(name: Key, fncallback: Events[Key]): this;
    /**
     * Run listening events.
     */
    public emit<Key extends keyof Events>(name: Key, ...args: Parameters<Events[Key]>): void;
    /**
     * Disable event.
     */
    public off<Key extends keyof Events>(name: Key, fncallback: Events[Key]): this;
    /**
     * Check event, if available returns true, if not available returns false.
     */
    public has<Key extends keyof Events>(name: Key): boolean;
    /**
     * Remove event.
     */
    public remove<Key extends keyof Events>(name: Key): EventResult[];
    /**
     * Add multiple events.
     */
    public add<Key1 extends keyof Events, Key2 extends keyof Events, Key3 extends keyof Events, Key4 extends keyof Events, Key5 extends keyof Events, Key6 extends keyof Events, Key7 extends keyof Events, Key8 extends keyof Events, Key9 extends keyof Events, Key10 extends keyof Events>(...events: { name: Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | Key10, listener: Events[Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | Key10], once?: boolean }[]): this
    /**
     * Check event is emitted.
     */
    public emitted<Key extends keyof Events>(name: Key): boolean;
    /**
     * Suspend listener.
     */
    public suspendListener<Key extends keyof Events>(name: Key, time: string): void;

    /**
     * unSuspend listener.
     */
    public unsuspendListener<Key extends keyof Events>(name: Key): void;
  }

  export class KiwiEmitterError extends Error {
    /**
     * Create new error instance.
     */
    private constructor(message: string, options?: KiwiEmitterErrorOptions);

    /**
     * Throw error.
     */
    public throw(): void;
  }

  export interface KiwiOptions {
    listenerLimit?: number;
    includeRejections?: boolean;
  }

  export interface EventObject {
    name: string;
    listener?: (...args: any[]) => unknown;
    once?: boolean;
  }

  export interface EventResult {
    name: string;
    state: ResultTypes;
  }

  export interface EventMap {
    [key: string]: (...args: any[]) => unknown
  }
  export type InterfaceToType<L> = {
    [key in keyof L]: L[key]
  }

  export type ResultTypes = "Deleted" | "NotDeleted";
}

interface KiwiEmitterErrorOptions {
  name?: string;
  stack?: string;
}