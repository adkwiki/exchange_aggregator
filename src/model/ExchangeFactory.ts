import { Exchange } from "./Exchange";

export function createInstance<T extends Exchange>(c: new () => T): T {
    return new c();
}