export const hereMapsEvents = {
    'pointerdown': 'pointerdown' as 'pointerdown',
    'pointerup': 'pointerup' as 'pointerup',
    'pointermove': 'pointermove' as 'pointermove',
    'pointerenter': 'pointerenter' as 'pointerenter',
    'pointerleave': 'pointerleave' as 'pointerleave',
    'pointercancel': 'pointercancel' as 'pointercancel',
    'dragstart': 'dragstart' as 'dragstart',
    'drag': 'drag' as 'drag',
    'dragend': 'dragend' as 'dragend',
    'tap': 'tap' as 'tap',
    'dbltap': 'dbltap' as 'dbltap',
};

export type HereMapsEvents = keyof typeof hereMapsEvents;

export type Listeners = {[k in HereMapsEvents]: () => (ev: HereMapsEvents) => void}

export function generateEventListeners(ctx: any, map: H.Map): Listeners {
    return (Object.keys(hereMapsEvents) as HereMapsEvents[])
      .reduce((acc, evName) => {
        const initListener = () => {
          const listener = (ev: any) => {
            const output = ctx[evName];
            output && output.emit(ev);
          };
          map.addEventListener(
            evName, 
            listener
          )
          return listener;
        }
        acc[evName] = initListener
        return acc;
    }, {} as Listeners )
}
