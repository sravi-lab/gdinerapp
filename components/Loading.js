import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Loading = () => {
  const strokeWidth = useSharedValue(0);
  const fillColor = useSharedValue("none");

  const animatedStrokeProps = useAnimatedProps(() => ({
    strokeWidth: strokeWidth.value,
  }));

  const animatedFillProps = useAnimatedProps(() => ({
    fill: fillColor.value,
  }));

  useEffect(() => {
    // console.log("Starting animations");
    strokeWidth.value = withRepeat(
      withTiming(6, { duration: 1000, easing: Easing.linear }),
      -1,
      true
    );
    // fillColor.value = withRepeat(
    //   withTiming("white", { duration: 1000, easing: Easing.linear }),
    //   -1,
    //   true
    // );
  }, [strokeWidth]);

  return (
    <View style={styles.container}>
      <Svg width="260" height="78" viewBox="0 0 360 78" fill="none">
        <AnimatedPath
          d="M51.4817 26.7156L51.9075 27.5H52.8H71.7H73.6385L73.152 25.6236C71.2011 18.0987 67.1701 12.1563 61.0647 7.87429C55.032 3.59639 47.6474 1.5 39 1.5C31.8404 1.5 25.4151 3.08518 19.7653 6.29221C14.1215 9.4291 9.69117 13.8628 6.49176 19.5661L6.48875 19.5715C3.3504 25.2206 1.79999 31.6435 1.79999 38.8C1.79999 45.9565 3.3504 52.3794 6.48875 58.0285L6.48869 58.0285L6.49565 58.0407C9.69592 63.676 14.124 68.1041 19.7593 71.3043L19.7688 71.3097L19.7783 71.315C25.4901 74.4495 31.9432 76 39.1 76C45.1638 76 50.6592 74.8274 55.5553 72.4493C60.3961 70.0981 64.4063 67.0035 67.5558 63.1561C70.7412 59.3459 73.0096 55.2015 74.338 50.7269L74.4 50.518V50.3V34.4V32.9H72.9H35.7H34.2V34.4V47V48.5H35.7H55.2139C53.9792 51.2752 52.2729 53.4195 50.1177 54.9869L50.1111 54.9917L50.1045 54.9967C47.5399 56.9051 44.3359 57.9 40.4 57.9C34.5824 57.9 30.1718 56.2052 26.9803 52.9593C23.8513 49.6438 22.2 44.9891 22.2 38.8C22.2 33.0176 23.7813 28.58 26.8006 25.3191L26.8007 25.3192L26.8099 25.309C29.8241 21.9934 33.8345 20.3 39 20.3C42.0011 20.3 44.5116 20.893 46.5844 22.0183L46.6066 22.0303L46.6292 22.0416C48.7575 23.1058 50.3633 24.6554 51.4817 26.7156ZM108.972 3.8V2.3H107.472H90.3719H88.8719V3.8V74V75.5H90.3719H107.472H108.972V74V3.8ZM179.864 3.8V2.3H178.364H124.064H122.564V3.8V17.5V19H124.064H141.164V74V75.5H142.664H159.764H161.264V74V19H178.364H179.864V17.5V3.8ZM208.246 75.5H209.322L209.667 74.4812L213.522 63.1H237.57L241.425 74.4812L241.77 75.5H242.846H260.946H263.084L262.357 73.4896L236.957 3.28965L236.599 2.3H235.546H215.746H214.694L214.336 3.28965L188.936 73.4896L188.208 75.5H190.346H208.246ZM357.677 3.8V2.3H356.177H336.077H335.062L334.684 3.24144L316.569 48.3895L298.267 3.23651L297.887 2.3H296.877H276.677H275.177V3.8V74V75.5H276.677H293.777H295.277V74V40.0842L308.172 74.526L308.536 75.5H309.577H323.377H324.418L324.782 74.5241L337.577 40.2152V74V75.5H339.077H356.177H357.677V74V3.8ZM219.03 46.9L225.554 27.4023L232.155 46.9H219.03Z"
          stroke="white"
          //   animatedProps={{ ...animatedStrokeProps, ...animatedFillProps }}
          animatedProps={animatedStrokeProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007367",
  },
});

export default Loading;
