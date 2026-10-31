export interface IStateStore<T> {
  getState(): T;
  setState(updater: (prev: T) => T): void;
}
