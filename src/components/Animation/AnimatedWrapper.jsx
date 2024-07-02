import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

const AnimatedWrapper = ({ children, isOpen }) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [display, setDisplay] = useState('none');
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        if (contentHeight === 0 && ref.current) {
          setContentHeight(ref.current.clientHeight);
        } else {
          clearInterval(interval);
        }
      }, 50);
    } else {
      setContentHeight(0);
    }
  }, [isOpen]);

  const animation = useSpring({
    from: { height: 0, opacity: 0, marginTop: '0px', width: '100%' },
    to: {
      height: isOpen ? contentHeight : 0,
      opacity: isOpen ? 1 : 0,
      marginTop: isOpen ? '8px' : '0px',
    },
    onStart: () => {
      if (isOpen) setDisplay('block');
    },
    onRest: () => {
      if (!isOpen) setDisplay('none');
    },
    config: { duration: 300 },
  });

  return (
    <animated.div style={{ ...animation, display }}>
      <div ref={ref}>
        {children}
      </div>
    </animated.div>
  );
};

export default AnimatedWrapper;