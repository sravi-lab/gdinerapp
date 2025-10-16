import React, { useState, useEffect } from "react";
import { Text } from "native-base";

const Counter = (props) => {
  const [counter, setCounter] = useState(props.sec);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      props.onComplete();
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <Text className="counterTime">{counter} sec</Text>
  );
};

export default Counter;