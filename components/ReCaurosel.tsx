import * as React from "react";
import { StyleSheet, Dimensions, View, Text, Alert } from "react-native";
import A, { Easing } from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const {
  Clock,
  cond,
  eq,
  neq,
  Value,
  set,
  block,
  add,
  stopClock,
  clockRunning,
  startClock,
  defined,
  concat,
  and,
  or,
  greaterOrEq,
  lessOrEq,
  spring,
  debug,
  greaterThan,
  sub,
  lessThan,
  multiply,
  divide,
  timing,
  call,
  round
} = A;

const { width, height } = Dimensions.get("window");
interface IState {
  currentProfileIndex: number;
  availablePrevCard: number;
}
function runTiming({ clock, value, dest, safeX, animState, onComplete }) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 500,

    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      set(animState, 0),
      // debug(" before safeX", safeX),

      set(safeX, dest),
      // debug(" after safeX", safeX),
      call([], onComplete)
    ]),
    state.position
  ]);
}

interface IProps {
  data: any;
  onItemSnapped: any;
  renderItem: any;
  currentIndex: number;
}

const arr = new Array(100).fill(0);
const ANIM_STATES = {
  N0_ANIMATION: 0,
  MOVE_FORWARD: 1,
  MOVE_SAFE: 2,
  MOVE_BACKWARD: 3,
  MOVE_SAFE_WITH_CALLBACK: 4
};
class ReCaurosel extends React.Component<IProps, IState> {
  static defaultProps = {
    currentIndex: 0
  };
  private initialPostion: any;
  private masterTranslateX: any;
  private gestureEvent: any;
  private safeX: any;
  private animState: A.Value<number>;
  private panState: any;
  private dragX: any;
  private clock: any;
  private velocityX: any;
  private forwardClock: any;
  private backwardClock: any;
  private normalClock: any;
  constructor(props) {
    super(props);
    this.state = {
      currentProfileIndex: 0,
      availablePrevCard: 2
    };
    this.initialPostion = new Value(0);
    this.safeX = new Value(0);
    this.clock = new Clock();
    this.dragX = new Value(0);
    this.velocityX = new Value(0);
    this.panState = new Value(State.UNDETERMINED);
    this.animState = new Value(ANIM_STATES.N0_ANIMATION);
    this.gestureEvent = A.event([
      {
        nativeEvent: {
          translationX: this.dragX,
          velocityX: this.velocityX,
          state: this.panState
        }
      }
    ]);
    this.masterTranslateX = new Value(0);
    this.forwardClock = new Clock();
    this.normalClock = new Clock();
    this.backwardClock = new Clock();
  }

  // componentDidUpdate = (prevProps: IProps, prevState: IState, _) => {
  //   if (prevState.currentProfileIndex !== this.state.currentProfileIndex) {
  //     alert(" index changed to " + this.state.currentProfileIndex);
  //     this.setState(prevState => {
  //       const availablePrevCard =
  //         prevState.currentProfileIndex > 2
  //           ? prevState.currentProfileIndex - 2
  //           : -1;
  //       return {
  //         availablePrevCard
  //       };
  //     });
  //   }
  // };

  preventEnd = new Value(0);
  renderCode = () => {
    const nextTransX = sub(this.safeX, width);
    const prevTrans = multiply(
      -1,
      multiply(this.state.availablePrevCard, width)
    );

    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.panState, State.ACTIVE), [
              cond(
                lessThan(this.velocityX, 0),
                [set(this.masterTranslateX, add(this.safeX, this.dragX))],
                [
                  cond(
                    greaterOrEq(this.dragX, 100),

                    [set(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK)],
                    [set(this.masterTranslateX, add(this.safeX, this.dragX))]
                  )
                ]
              )
            ]),
            cond(and(eq(this.panState, State.END), eq(this.preventEnd, 0)), [
              cond(
                lessThan(this.dragX, -100),
                [set(this.animState, ANIM_STATES.MOVE_FORWARD)],

                [
                  cond(
                    greaterThan(this.dragX, 100),
                    [set(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK)],
                    [set(this.animState, ANIM_STATES.MOVE_SAFE)]
                  )
                ]
              ),
              set(this.panState, State.UNDETERMINED)
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_FORWARD), [
              set(
                this.masterTranslateX,
                runTiming({
                  clock: this.forwardClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: nextTransX,
                  safeX: this.safeX,
                  onComplete: () => {
                    this.setState(({ currentProfileIndex }) => ({
                      currentProfileIndex: currentProfileIndex + 1
                    }));
                  }
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_BACKWARD), [
              set(
                this.masterTranslateX,
                runTiming({
                  clock: this.backwardClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: prevTrans,
                  safeX: this.safeX,
                  onComplete: () => {
                    // this.safeX.setValue(prevTrans);

                    this.setState(({ currentProfileIndex }) => ({
                      currentProfileIndex: currentProfileIndex - 1
                    }));
                  }
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE), [
              set(
                this.masterTranslateX,
                runTiming({
                  clock: this.normalClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: this.safeX,
                  safeX: this.safeX,
                  onComplete: () => ({})
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK), [
              set(
                this.masterTranslateX,
                runTiming({
                  clock: this.backwardClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: this.safeX,
                  safeX: this.safeX,
                  onComplete: () => {
                    if (this.state.currentProfileIndex === 0) {
                      alert(" cant move any backward this is initial position");
                    } else if (this.state.availablePrevCard === -1 && false) {
                      alert(" not available ");
                    } else if (this.state.availablePrevCard % 2 === 0 || true) {
                      Alert.alert(" go to -2", "just do it", [
                        {
                          text: "yes",
                          onPress: () => {
                            this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                          }
                        },
                        {
                          text: "no",
                          onPress: () => {
                            // this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                          }
                        }
                      ]);
                    } else {
                    }
                    // this.safeX.setValue(prevTrans);
                    // this.setState(({ currentProfileIndex }) => ({
                    //   currentProfileIndex: currentProfileIndex - 1
                    // }));
                  }
                })
              )
            ])
          ])
        }
      </A.Code>
    );
  };
  render() {
    const { renderItem } = this.props;
    const { currentProfileIndex } = this.state;
    return (
      <>
        {this.renderCode()}
        <View
          style={{
            flex: 1,
            // backgroundColor: "blue",
            ...StyleSheet.absoluteFillObject
          }}
        >
          <PanGestureHandler
            onHandlerStateChange={this.gestureEvent}
            onGestureEvent={this.gestureEvent}
          >
            <A.View style={{}}>
              <ReText
                text={concat(round(divide(this.masterTranslateX, width)), "")}
              />
              <Text
                style={{
                  textAlign: "center"
                }}
              >
                {currentProfileIndex}
              </Text>
              <A.View
                style={{
                  height: height * 0.8,
                  marginTop: 32,
                  flexDirection: "row",
                  // backgroundColor: "green",
                  left: 0,
                  alignItems: "center",
                  justifyContent: "flex-start",

                  transform: [
                    {
                      translateX: this.masterTranslateX
                    },
                    {
                      scale: 1
                    }
                  ]
                }}
              >
                {arr.map((_, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        width: width,
                        height: 300,
                        backgroundColor: i % 2 === 0 ? "#c3c993" : "red",
                        // marginLeft: i === 0 ? 20 : 0,
                        // marginRight: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 52
                        }}
                      >
                        {i}
                      </Text>
                    </View>
                  );
                })}
              </A.View>
            </A.View>
          </PanGestureHandler>
        </View>
      </>
    );
  }
}

//19q65a0431

export default ReCaurosel;
