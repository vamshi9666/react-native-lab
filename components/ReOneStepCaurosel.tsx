import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Alert,
  Platform
} from "react-native";
import A, { Easing } from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { PanGestureHandler, State } from "react-native-gesture-handler";

// Transitioning.

const {
  Clock,
  cond,
  eq,
  Value,
  set,
  block,
  add,
  stopClock,
  clockRunning,
  startClock,
  defined,
  concat,
  onChange,
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

// const width = w / 2;
const P = <T extends any>(android: T, ios: T): T =>
  Platform.OS === "ios" ? ios : android;

function runTiming({ value, dest, safeX, completeNode }) {
  const clock = new Clock();
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
      set(completeNode, 1),
      // debug(" before safeX", safeX),

      set(safeX, dest)
      // debug(" after safeX", safeX),
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
  currentProfileIndex: number;
  availablePrevCard: number;
  showLast: boolean;
  showFirst: boolean;
  firstObj: any;
  secondObj: any;
  thirdObj: any;
  fourthObj: any;
  objToBeUpdatedForRightSwipe: number;
  currentInViewPort?: number;
}

const ANIM_STATES = {
  N0_ANIMATION: 0,
  MOVE_FORWARD: 1,
  MOVE_SAFE: 2,
  MOVE_BACKWARD: 3,
  MOVE_SAFE_WITH_CALLBACK: 4
};
const CARD_INDEXES = {
  NONE: -1,
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
  FOURTH: 3
};
const DRAG_THRESHOLD = 180;
class ReOneStepCaurosel extends React.Component<IProps, IState> {
  static defaultProps = {
    currentIndex: 0
  };
  private gestureEvent: any;
  private safeX: any;
  private animState: A.Value<number>;
  private panState: A.Adaptable<any>;
  private dragX: A.Adaptable<any>;
  private progressclock: any;
  private velocityX: A.Adaptable<any>;
  private forwardClock: any;
  private backwardClock: any;
  private normalClock: any;
  private firstCardTransX: A.Adaptable<any>;
  private secondCardTransX: A.Adaptable<any>;
  private thirdCardTransX: A.Adaptable<any>;
  private fourthCardTransX: A.Adaptable<any>;
  private backwardComplete: A.Value<1 | 0>;
  private forwardComplete: A.Value<1 | 0>;

  private firstCardSafeX: A.Adaptable<any>;
  private secondCardSafeX: A.Adaptable<any>;
  private thirdCardSafeX: A.Adaptable<any>;
  private fourthCardSafeX: A.Adaptable<any>;
  private backWardCallbackComplete: any;
  private values: Array<A.Adaptable<any>>;
  private valueToPushLast: A.Value<number>;
  private valueToPushFirst: A.Value<number>;
  constructor(props: IProps) {
    super(props);
    const { startIndex } = props;

    this.state = {
      showLast: true,
      showFirst: true,
      currentProfileIndex: 0,
      availablePrevCard: 2,
      firstObj: null,
      secondObj: null,
      thirdObj: null,
      fourthObj: null,
      objToBeUpdatedForRightSwipe: -1
      // currentInViewPort:
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
    this.forwardClock = new Clock();
    this.normalClock = new Clock();
    this.backwardClock = new Clock();

    this.firstCardTransX = new Value(0);
    this.secondCardTransX = new Value(width);
    this.thirdCardTransX = new Value(2 * width);
    this.fourthCardTransX = new Value(3 * width);

    //safevalues

    this.firstCardSafeX = new Value(0);
    this.secondCardSafeX = new Value(width);
    this.thirdCardSafeX = new Value(2 * width);
    this.fourthCardSafeX = new Value(3 * width);
    //complete nodes
    this.forwardComplete = new Value(0);
    this.backwardComplete = new Value(0);
    this.backWardCallbackComplete = new Value(0);
    this.valueToPushLast = new Value(CARD_INDEXES.NONE);
    this.valueToPushFirst = new Value(CARD_INDEXES.NONE);

    this.values = [0, 1, 2, 3].map(i => {
      const val = new Value(i * width);
      return {
        activeValue: val,
        safeX: val
      };
    });
  }

  reArrangeData = (initialRender?: boolean, forward?: boolean) => {
    requestAnimationFrame(() => {
      const { data, startIndex } = this.props;
      const { currentProfileIndex } = this.state;

      if (initialRender) {
        const prevObj = data[0];
        const currentObj = data[1];
        const nextObj = data[2];
        const fourthObj = data[3];

        this.setState({
          firstObj: prevObj,
          secondObj: currentObj,
          thirdObj: nextObj,
          fourthObj
          // data: arr
        });
      } else {
        if (forward) {
          const lastObj = this.props.data[currentProfileIndex + 2];
          const {
            objToBeUpdatedForRightSwipe,
            firstObj,
            secondObj,
            thirdObj,
            fourthObj
          } = this.state;
          console.log(" old step are ", {
            firstObj,
            secondObj,
            thirdObj,
            fourthObj,
            objToBeUpdatedForRightSwipe
          });
          const targetObj =
            objToBeUpdatedForRightSwipe === 0
              ? "firstObj"
              : objToBeUpdatedForRightSwipe === 1
              ? "secondObj"
              : objToBeUpdatedForRightSwipe === 2
              ? "thirdObj"
              : "fourthObj";
          this.setState(
            {
              [targetObj]: lastObj
            },
            () => {
              const { firstObj, secondObj, thirdObj, fourthObj } = this.state;

              console.log(" new step are ", {
                firstObj,
                secondObj,
                thirdObj,
                fourthObj,
                targetObj
              });
            }
          );
        }
      }
    });
  };
  componentDidMount = () => {
    this.reArrangeData(true, true);
  };

  preventEnd = new Value(0);
  callBackInProgress = new Value(0);
  renderCallbackCode = () => {
    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.backwardComplete, 1), [
              set(this.animState, 0),
              set(this.preventEnd, 0),
              cond(eq(this.valueToPushFirst, 0), [
                set(this.firstCardTransX, -2 * width),
                set(this.firstCardSafeX, -2 * width)
              ]),
              cond(eq(this.valueToPushFirst, 1), [
                set(this.secondCardTransX, -2 * width),
                set(this.secondCardSafeX, -2 * width)
              ]),
              cond(eq(this.valueToPushFirst, 2), [
                set(this.thirdCardTransX, -2 * width),
                set(this.thirdCardSafeX, -2 * width)
              ]),
              cond(eq(this.valueToPushFirst, 3), [
                set(this.fourthCardTransX, -2 * width),
                set(this.fourthCardSafeX, -2 * width)
              ]),

              call([], () => {
                this.setState(
                  ({ currentProfileIndex }) => ({
                    currentProfileIndex: this.props.availablePrevCard
                  }),
                  () => {
                    alert(" backward");
                    // this.props.onItemSnapped({
                    //   newIndex: this.state.currentProfileIndex,
                    //   direction: "left",
                    //   goBack: () => ({})
                    // });
                  }
                );
              }),
              set(this.backwardComplete, 0)
            ]),
            cond(eq(this.forwardComplete, 1), [
              set(this.animState, 0),
              set(this.preventEnd, 0),
              cond(eq(this.valueToPushLast, 0), [
                set(this.firstCardTransX, 1 * width),
                set(this.firstCardSafeX, 1 * width)
              ]),
              cond(eq(this.valueToPushLast, 1), [
                set(this.secondCardTransX, 1 * width),
                set(this.secondCardSafeX, 1 * width)
              ]),
              cond(eq(this.valueToPushLast, 2), [
                set(this.thirdCardTransX, 1 * width),
                set(this.thirdCardSafeX, 1 * width)
              ]),
              cond(eq(this.valueToPushLast, 3), [
                set(this.fourthCardTransX, 1 * width),
                set(this.fourthCardSafeX, 1 * width)
              ]),
              call([], () => {
                const { currentProfileIndex, currentInViewPort } = this.state;
                alert("now is" + this.state.currentInViewPort);
                if (currentInViewPort === undefined) {
                  this.valueToPushLast.setValue(0);
                } else {
                  this.valueToPushLast.setValue(currentInViewPort);
                }
                this.setState(
                  {
                    currentProfileIndex: currentProfileIndex + 1,
                    currentInViewPort:
                      currentInViewPort < 3 ? currentInViewPort + 1 : 0,
                    objToBeUpdatedForRightSwipe: currentInViewPort
                  },
                  () => {
                    if (this.state.currentProfileIndex !== 1) {
                      this.reArrangeData(false, true);
                    }
                    this.props.onItemSnapped({
                      newIndex: this.state.currentProfileIndex,
                      direction: "right",
                      goBack: () => ({})
                    });
                  }
                );
              }),
              set(this.forwardComplete, 0)
            ]),
            cond(eq(this.backWardCallbackComplete, 1), [
              set(this.animState, 0),
              // set(this.callBackInProgress, 0),
              // set(this.preventEnd, 0),
              call([], () => {
                if (this.state.currentProfileIndex === 0) {
                  alert(" cant move any backward this is initial position");
                } else if (this.state.availablePrevCard === -1) {
                  alert(" not available ");
                }

                // if (this.state.availablePrevCard % 2 === 0)
                else {
                  if (this.state.currentProfileIndex !== 2) {
                    // alert(this.state.currentProfileIndex);
                    const {
                      currentInViewPort,
                      currentProfileIndex
                    } = this.state;
                    this.setState({
                      currentProfileIndex: currentProfileIndex + 1,
                      currentInViewPort:
                        currentInViewPort > 0 ? currentInViewPort - 1 : 3,
                      objToBeUpdatedForRightSwipe: currentInViewPort
                    });
                  }
                  this.props.callBack({
                    oldIndex: this.state.currentProfileIndex,
                    newIndex: this.state.availablePrevCard,
                    continue: () => {
                      requestAnimationFrame(() => {
                        this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                      });
                    },
                    renable: () => this.callBackInProgress.setValue(0)
                  });
                }
              }),
              set(this.backWardCallbackComplete, 0)
            ])
            // debug("fist one trans is ", this.firstCardTransX)
          ])
        }
      </A.Code>
    );
  };

  renderAnimationsCode = () => {
    const nextTransX = sub(this.safeX, width);
    const prevTrans = add(this.safeX, width);
    const setAllCardsEndToSafe = (completeNode: A.Adaptable<any>) => [
      set(
        this.firstCardTransX,
        runTiming({
          // velocity: this.velocityX,
          completeNode: completeNode,
          // clock: this.normalClock,
          // animState: this.animState,
          value: this.firstCardTransX,
          dest: this.firstCardSafeX,
          safeX: this.firstCardSafeX
        })
      ),
      set(
        this.secondCardTransX,
        runTiming({
          // velocity: this.velocityX,
          completeNode: new Value(0),
          // clock: this.normalClock,
          // animState: this.animState,
          value: this.secondCardTransX,
          dest: this.secondCardSafeX,
          safeX: this.secondCardSafeX
        })
      ),
      set(
        this.thirdCardTransX,
        runTiming({
          // velocity: this.velocityX,
          completeNode: new Value(0),
          // clock: this.normalClock,
          // animState: this.animState,
          value: this.thirdCardTransX,
          dest: this.thirdCardSafeX,
          safeX: this.thirdCardSafeX
        })
      ),
      set(
        this.fourthCardTransX,
        runTiming({
          // velocity: this.velocityX,
          completeNode: new Value(0),
          // clock: this.normalClock,
          // animState: this.animState,
          value: this.fourthCardTransX,
          dest: this.fourthCardSafeX,
          safeX: this.fourthCardSafeX
        })
      )
    ];
    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.animState, ANIM_STATES.MOVE_FORWARD), [
              set(
                this.firstCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.firstCardTransX,
                  dest: add(this.firstCardSafeX, nextTransX),
                  safeX: this.firstCardSafeX,
                  completeNode: this.forwardComplete
                })
              ),
              set(
                this.secondCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.secondCardTransX,
                  dest: add(this.secondCardSafeX, nextTransX),
                  safeX: this.secondCardSafeX,
                  completeNode: new Value(0)
                })
              ),
              set(
                this.thirdCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.thirdCardTransX,
                  dest: add(this.thirdCardSafeX, nextTransX),
                  safeX: this.thirdCardSafeX,
                  completeNode: new Value(0)

                  // completeNode: this.forwardComplete
                })
              ),
              set(
                this.fourthCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.fourthCardTransX,
                  dest: add(this.fourthCardSafeX, nextTransX),
                  safeX: this.fourthCardSafeX,
                  completeNode: new Value(0)

                  // completeNode: this.forwardComplete
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_BACKWARD), [
              set(
                this.firstCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.firstCardTransX,
                  dest: sub(this.firstCardSafeX, nextTransX),
                  safeX: this.firstCardSafeX,
                  completeNode: this.backwardComplete
                })
              ),
              set(
                this.secondCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.secondCardTransX,
                  dest: sub(this.secondCardSafeX, nextTransX),
                  safeX: this.secondCardSafeX,
                  completeNode: new Value(0)
                })
              ),
              set(
                this.thirdCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.thirdCardTransX,
                  dest: sub(this.thirdCardSafeX, nextTransX),
                  safeX: this.thirdCardSafeX,
                  completeNode: new Value(0)

                  // completeNode: this.forwardComplete
                })
              ),
              set(
                this.fourthCardTransX,
                runTiming({
                  // velocity: this.velocityX,
                  // clock: this.forwardClock,
                  // animState: this.animState,
                  value: this.fourthCardTransX,
                  dest: sub(this.fourthCardSafeX, nextTransX),
                  safeX: this.fourthCardSafeX,
                  completeNode: new Value(0)

                  // completeNode: this.forwardComplete
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE), [
              ...setAllCardsEndToSafe(new Value(0)),
              set(this.callBackInProgress, 0),
              set(this.preventEnd, 0)
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK), [
              ...setAllCardsEndToSafe(this.backWardCallbackComplete)
            ])
          ])
        }
      </A.Code>
    );
  };
  renderEventsCode = () => {
    const setAllCardsActive = [
      set(this.firstCardTransX, add(this.firstCardSafeX, this.dragX)),
      set(this.secondCardTransX, add(this.secondCardSafeX, this.dragX)),
      set(this.thirdCardTransX, add(this.thirdCardSafeX, this.dragX)),
      set(this.fourthCardTransX, add(this.fourthCardSafeX, this.dragX))
    ];
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
                  [...setAllCardsActive],
                  [
                    set(this.preventEnd, 1),
                    cond(
                      and(
                        greaterOrEq(this.dragX, DRAG_THRESHOLD),
                        eq(this.callBackInProgress, 0)
                      ),

                      [
                        set(this.callBackInProgress, 1),
                        set(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK)
                      ],
                      [...setAllCardsActive]
                    )
                  ]
                )
              ]
            ),
            // debug("bow", this.preventEnd),

            cond(and(eq(this.preventEnd, 0), eq(this.panState, State.END)), [
              cond(
                lessThan(this.dragX, -1 * DRAG_THRESHOLD),
                [set(this.animState, ANIM_STATES.MOVE_FORWARD)],

                [
                  cond(
                    and(
                      eq(this.callBackInProgress, 0),
                      greaterThan(this.dragX, DRAG_THRESHOLD)
                    ),
                    [set(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK)],
                    [set(this.animState, ANIM_STATES.MOVE_SAFE)]
                    // [set(this.animState, ANIM_STATES.MOVE_BACKWARD)],
                    // [set(this.animState, ANIM_STATES.MOVE_FORWARD)]
                  )
                ]
              )
              // set(this.panState, State.UNDETERMINED)
            ])
          ])
        }
      </A.Code>
    );
  };
  render() {
    const { renderItem } = this.props;
    const { firstObj, secondObj, thirdObj, fourthObj } = this.state;
    return (
      <>
        {this.renderEventsCode()}
        {this.renderAnimationsCode()}
        {this.renderCallbackCode()}
        <View
          style={{
            flex: 1,
            ...StyleSheet.absoluteFillObject
          }}
        >
          <PanGestureHandler
            onHandlerStateChange={this.gestureEvent}
            onGestureEvent={this.gestureEvent}
          >
            <A.View style={{}}>
              <ReText text={concat("", this.animState)} />
              <A.View
                style={{
                  height: height * 0.8,
                  marginTop: 32,
                  flexDirection: "row",
                  left: 0,
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <A.View
                  style={{
                    position: "absolute",
                    backgroundColor: "green",
                    paddingVertical: 8,
                    // zIndex: 1,
                    transform: [{ translateX: this.firstCardTransX }]
                  }}
                >
                  {renderItem({ item: firstObj, index: 0 })}
                </A.View>

                <A.View
                  style={{
                    position: "absolute",
                    paddingVertical: 8,

                    backgroundColor: "blue",

                    // zIndex: 100,
                    transform: [{ translateX: this.secondCardTransX }]
                  }}
                >
                  {renderItem({ item: secondObj, index: 1 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    backgroundColor: "pink",
                    paddingVertical: 8,

                    transform: [{ translateX: this.thirdCardTransX }]
                  }}
                >
                  {renderItem({ item: thirdObj, index: 2 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    backgroundColor: "orange",
                    paddingVertical: 8,

                    transform: [{ translateX: this.fourthCardTransX }]
                  }}
                >
                  {renderItem({ item: fourthObj, index: 3 })}
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
