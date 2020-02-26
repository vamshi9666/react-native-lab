import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Alert,
  Platform
} from "react-native";
import { isEqual } from "lodash";
import A, {
  Easing,
  Transition,
  TransitioningView
} from "react-native-reanimated";
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
  round,
  SpringUtils
} = A;

const { width, height } = Dimensions.get("window");

const P = <T extends any>(android: T, ios: T): T =>
  Platform.OS === "ios" ? ios : android;

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

const magic = {
  damping: 1200,
  mass: 1,
  stiffness: 121.6,
  overshootClamping: true,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
  deceleration: 0.399,
  bouncyFactor: 1,
  velocityFactor: P(1, 0.8),
  toss: 0.4,
  coefForTranslatingVelocities: 5
};

const {
  damping,
  mass,
  stiffness,
  overshootClamping,
  restSpeedThreshold,
  restDisplacementThreshold,
  deceleration,
  velocityFactor,
  toss
} = magic;
function runSpring({
  clock,
  value,
  velocity,
  dest,
  animState,
  safeX,
  onComplete
}) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    damping,
    mass,
    stiffness,
    overshootClamping,
    restSpeedThreshold,
    restDisplacementThreshold,
    // ...SpringUtils.makeDefaultConfig(),
    toValue: new Value(0)
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      set(animState, 0),
      // debug(" before safeX", safeX),

      set(safeX, dest),
      // debug(" after safeX", safeX),
      call([], onComplete)
    ]),
    state.position
  ];
}
interface IProps {
  data: any;
  onItemSnapped: any;
  renderItem: any;
  currentIndex: number;
  availablePrevCard: number;
  startIndex: number;
  callBack: any;
}

interface IState {
  data: any[];
  currentProfileIndex: number;
  availablePrevCard: number;
}

const ANIM_STATES = {
  N0_ANIMATION: 0,
  MOVE_FORWARD: 1,
  MOVE_SAFE: 2,
  MOVE_BACKWARD: 3,
  MOVE_SAFE_WITH_CALLBACK: 4
};
class ReOneStepCaurosel extends React.Component<IProps, IState> {
  static defaultProps = {
    currentIndex: 0
  };
  private masterTranslateX: any;
  private gestureEvent: any;
  private safeX: any;
  private animState: A.Value<number>;
  private panState: any;
  private dragX: any;
  private progressclock: any;
  private velocityX: any;
  private forwardClock: any;
  private backwardClock: any;
  private normalClock: any;
  constructor(props: IProps) {
    super(props);
    const { startIndex } = props;

    this.state = {
      data: [],
      currentProfileIndex: startIndex,
      availablePrevCard: 2
    };
    this.safeX = new Value(0);
    this.progressclock = new Clock();
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
  reArrangeData = (initialRender?: boolean) => {
    const { data, startIndex } = this.props;
    const { currentProfileIndex } = this.state;
    if (initialRender) {
      const prevObj = data[1];
      const nextObj = data[currentProfileIndex + 1];
      const fourthObj = data[currentProfileIndex + 2];
      const arr = [prevObj, data[currentProfileIndex], nextObj, fourthObj];
      this.setState(
        {
          data: arr
        },
        () => {
          console.log(" after is ", this.state.data);
        }
      );
    } else {
      const lastObj = data[currentProfileIndex + 1];
      this.setState(({ data }) => {
        const newData = Object.assign([], data);
        newData.push(lastObj);
        newData.splice(0, 1);
        // this.masterTranslateX.setValue(add(this.masterTranslateX, width));

        return {
          data: newData
        };
      });
    }
  };
  componentDidMount = () => {
    this.reArrangeData(true);
  };

  preventEnd = new Value(0);
  callBackInProgress = new Value(0);
  renderCode = () => {
    const nextTransX = sub(this.safeX, width);
    const prevTrans = add(this.safeX, width);

    return (
      <A.Code>
        {() =>
          block([
            cond(
              and(
                eq(this.panState, State.ACTIVE),
                eq(this.callBackInProgress, 0)
              ),
              [
                cond(
                  lessThan(this.velocityX, 0),
                  [set(this.masterTranslateX, add(this.safeX, this.dragX))],
                  [
                    set(this.preventEnd, 1),

                    cond(
                      and(
                        greaterOrEq(this.dragX, 200),
                        eq(this.callBackInProgress, 0)
                      ),
                      [
                        set(this.callBackInProgress, 1),
                        set(
                          this.animState,
                          ANIM_STATES.MOVE_SAFE_WITH_CALLBACK
                        ),
                        set(this.panState, State.UNDETERMINED)
                      ],
                      [set(this.masterTranslateX, add(this.safeX, this.dragX))]
                    )
                  ]
                )
              ]
            ),
            cond(
              and(eq(this.callBackInProgress, 0), eq(this.panState, State.END)),
              [
                cond(
                  lessThan(this.dragX, -100),
                  [set(this.animState, ANIM_STATES.MOVE_FORWARD)],

                  [
                    cond(
                      and(eq(this.preventEnd, 0), greaterThan(this.dragX, 100)),
                      [
                        set(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK)
                      ],
                      [set(this.animState, ANIM_STATES.MOVE_SAFE)]
                    )
                  ]
                ),
                set(this.panState, State.UNDETERMINED)
              ]
            ),
            cond(eq(this.animState, ANIM_STATES.MOVE_FORWARD), [
              set(
                this.masterTranslateX,
                runSpring({
                  velocity: this.velocityX,
                  clock: this.forwardClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: nextTransX,
                  safeX: this.safeX,
                  onComplete: () => {
                    this.setState(
                      ({ currentProfileIndex }) => ({
                        currentProfileIndex: currentProfileIndex + 1
                      }),
                      () => {
                        this.reArrangeData();
                        this.props.onItemSnapped({
                          newIndex: this.state.currentProfileIndex,
                          direction: "right",
                          goBack: () => ({})
                        });
                      }
                    );
                  }
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_BACKWARD), [
              set(
                this.masterTranslateX,
                runSpring({
                  velocity: this.velocityX,

                  clock: this.backwardClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: prevTrans,
                  safeX: this.safeX,
                  onComplete: () => {
                    this.setState(
                      ({ currentProfileIndex }) => ({
                        currentProfileIndex: this.props.availablePrevCard
                      }),

                      () => {
                        this.props.onItemSnapped({
                          newIndex: this.state.currentProfileIndex,
                          direction: "left",
                          goBack: () => ({})
                        });
                      }
                    );
                  }
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE), [
              set(
                this.masterTranslateX,
                runSpring({
                  velocity: this.velocityX,
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
                runSpring({
                  velocity: this.velocityX,
                  clock: this.backwardClock,
                  animState: this.animState,
                  value: this.masterTranslateX,
                  dest: this.safeX,
                  safeX: this.safeX,
                  onComplete: () => {
                    if (this.state.currentProfileIndex === 0) {
                      alert(" cant move any backward this is initial position");
                    } else if (this.state.availablePrevCard === -1) {
                      alert(" not available ");
                    }

                    // if (this.state.availablePrevCard % 2 === 0)
                    else {
                      this.props.callBack({
                        oldIndex: this.state.currentProfileIndex,
                        newIndex: this.state.availablePrevCard,
                        continue: () => {
                          requestAnimationFrame(() => {
                            this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                            this.callBackInProgress.setValue(0);
                          });
                        },
                        renable: () => this.callBackInProgress.setValue(0)
                      });
                      // Alert.alert(" go to -2", "just do it", [
                      //   {
                      //     text: "yes",
                      //     onPress: () => {
                      //       this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                      //       this.callBackInProgress.setValue(0);
                      //     }
                      //   },
                      //   {
                      //     text: "no",
                      //     onPress: () => {
                      //       this.callBackInProgress.setValue(0);
                      //     }
                      //   }
                      // ]);
                    }
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
    const { currentProfileIndex, data } = this.state;
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
              {/*<ReText
                text={concat(round(divide(this.masterTranslateX, width)), "")}
              />*/}
              <Text
                style={{
                  textAlign: "center"
                }}
              >
                {data.length}
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
                <A.View
                  style={{
                    position: "absolute",
                    transform: [{ translateX: 0 * width }]
                  }}
                >
                  {renderItem({ item: data[0], index: 0 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    transform: [{ translateX: 1 * width }]
                  }}
                >
                  {renderItem({ item: data[1], index: 1 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    transform: [{ translateX: 2 * width }]
                  }}
                >
                  {renderItem({ item: data[2], index: 2 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    transform: [{ translateX: 3 * width }]
                  }}
                >
                  {renderItem({ item: data[3], index: 3 })}
                </A.View>
              </A.View>
            </A.View>
          </PanGestureHandler>
        </View>
      </>
    );
  }
}

//19q65a0431

export default ReOneStepCaurosel;
