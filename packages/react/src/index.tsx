import React from 'react';
import usePrevious from './hooks/usePrevious';
import styles from './global.module.css';

export type InfiniteScrollProps<elementType = unknown> = {
  children: React.ReactNode;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  observerOptions?: Omit<IntersectionObserverInit, 'threshold'> & { threshold?: number };
};

const THRESHOLD = 15;
const InfiniteScroll = <T,>(props: InfiniteScrollProps<T>) => {
  const { children, className, style, height, observerOptions = {} } = props;
  const childrenArray = React.Children.toArray(children) ?? [];
  const [positions, setPositions] = React.useState({
    start: 0,
    end: THRESHOLD
  });

  const topElement = React.createRef<HTMLDivElement>();
  const bottomElement = React.createRef<HTMLDivElement>();
  const observer = React.useRef<IntersectionObserver | null>(null);
  const { start, end } = positions;

  const obServerCallback: IntersectionObserverCallback = (entries, ob) => {
    entries.forEach((entry) => {
      const listLength = childrenArray.length;

      if (entry.isIntersecting && entry.target.id === "bottom") {
        const maxStartIndex = listLength - 1 - THRESHOLD;
        const maxEndIndex = listLength - 1;
        const newEnd = (end + 10) <= maxEndIndex ? end + 10 : maxEndIndex;
        const newStart = (end - 5) <= maxStartIndex ? end - 5 : maxStartIndex;
        updateState(newStart, newEnd);
      }
      // // Scroll up
      // if (entry.isIntersecting && entry.target.id === "top") {
      //   const newEnd = end === THRESHOLD ? THRESHOLD : (end - 10 > THRESHOLD ? end - 10 : THRESHOLD);
      //   const newStart = start === 0 ? 0 : (start - 10 > 0 ? start - 10 : 0);
      //   updateState(newStart, newEnd);
      // }
    });
  };

  const resetObservation = () => {
    if (bottomElement.current) observer.current?.unobserve(bottomElement.current);
    if (topElement.current) observer.current?.unobserve(topElement.current);
  }

  const updateState = (newStart: number, newEnd: number) => {
    if (start !== newStart || end !== newEnd) {
      resetObservation();
      setPositions({ start: newStart, end: newEnd });
    }
  }

  const initialScrollObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: observerOptions?.threshold ?? 0.01,
      ...observerOptions
    };
    observer.current = new IntersectionObserver(obServerCallback, options);
    if (topElement.current) {
      observer.current.observe(topElement.current);
    }
    if (bottomElement.current) {
      observer.current.observe(bottomElement.current);
    }
  };

  const preStart = usePrevious(start);
  const preEnd = usePrevious(end);
  React.useEffect(() => {
    if (preStart !== start || preEnd !== end) {
      initialScrollObserver();
    }
  }, [start, end]);

  const getReference = (index: number, isLatest: boolean) => {
    if (index === 0)
      return topElement;
    if (isLatest)
      return bottomElement;
    return null;
  };

  let wrapperClass = styles.infiniteScroll;
  if (className) wrapperClass += ` ${className}`;
  return <div
    className={wrapperClass}
    style={{ height: height, ...style }}
  >
    {childrenArray.slice(start, end).map((child, index, arr) => {
      const lastIndex = arr.length - 1;

      const ref = getReference(index, index === lastIndex);

      let classNameItem = styles.infiniteScrollItem;
      if (index === 0) classNameItem += ` ${styles.infiniteScrollItemFirst}`;
      if (index === lastIndex) classNameItem += ` ${styles.infiniteScrollItemLast}`;
      return (
        <div
          key={React.isValidElement(child) ? child.key : index}
          ref={ref}
          className={classNameItem}
          id={index === 0 ? "top" : index === lastIndex ? "bottom" : ""}
        >
          {child}
        </div>
      );
    })}
  </div>;
};

export default InfiniteScroll;