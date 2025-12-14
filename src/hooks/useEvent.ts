import { RefObject, useEffect } from 'react';

export type UseEventParams = {
  elem?: RefObject<HTMLElement> | RefObject<HTMLElement>[] | HTMLElement | HTMLElement[];
  event: string | string[];
  callback: (event: Event) => void;
  isActive?: boolean;
  isCapture?: boolean;
};

/**
 *
 * @param param0
 */
export default function useEvent({
  elem,
  event,
  callback,
  isActive = true,
  isCapture = false,
}: UseEventParams): void {
  useEffect(() => {
    const events = Array.isArray(event) ? event : [event];
    const elems = elem ? (Array.isArray(elem) ? elem : [elem]) : [document];
    const getElem = (el: RefObject<HTMLElement> | HTMLElement | Document) =>
      el && ('current' in el ? el.current : el);

    const each = cb => {
      events.forEach(ev => {
        elems.forEach(el => cb(getElem(el), ev));
      });
    };

    const enable = () => {
      // console.log('### useEvent() - enable()', elems, events);
      each((el, ev) => el?.addEventListener(ev, callback, isCapture));
    };
    const disable = () => {
      // console.log('### useEvent() - disable()', elems, events);
      each((el, ev) => el?.removeEventListener(ev, callback));
    };

    const hasRef = !elem || elems.some(getElem);

    if (isActive && hasRef) {
      // console.log('### useEvent() - enable()', events);
      enable();
    }

    return () => {
      // console.log('### useEvent() - disable()', events);
      disable();
    };
  }, [isActive, elem, event, callback]);
}
