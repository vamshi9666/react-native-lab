import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Button,
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
  data: Array<any>;
  onItemSnapped: any;
  renderItem: any;
  currentIndex: number;
  availablePrevCard: number;
  startIndex: number;
  callBack: any;
}

interface IState {
  currentProfileIndex: number;
  // availablePrevCard: number;
  firstObj: any;
  secondObj: any;
  thirdObj: any;
  fourthObj: any;
  objToBeUpdatedForRightSwipe: number;
  currentInViewPort?: number;
  objToBeUpdatedForLeftSwipe: number;
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
    const initValue = 0;
    this.state = {
      currentProfileIndex: initValue,
      // availablePrevCard: 2,
      firstObj: null,
      secondObj: null,
      thirdObj: null,
      fourthObj: null,
      objToBeUpdatedForRightSwipe: CARD_INDEXES.NONE,
      objToBeUpdatedForLeftSwipe: CARD_INDEXES.FOURTH,
      currentInViewPort: CARD_INDEXES.FIRST
    };
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
    const firstCardValue = 0 * width;
    const secondCardValue = 1 * width;
    const thirdCardValue = 2 * width;
    const fourthCardValue = 3 * width;
    this.firstCardTransX = new Value(firstCardValue);
    this.secondCardTransX = new Value(secondCardValue);
    this.thirdCardTransX = new Value(thirdCardValue);
    this.fourthCardTransX = new Value(fourthCardValue);

    //safevalues

    this.firstCardSafeX = new Value(firstCardValue);
    this.secondCardSafeX = new Value(secondCardValue);
    this.thirdCardSafeX = new Value(thirdCardValue);
    this.fourthCardSafeX = new Value(fourthCardValue);
    //complete nodes
    this.forwardComplete = new Value(0);
    this.backwardComplete = new Value(0);
    this.backWardCallbackComplete = new Value(0);
    this.valueToPushLast = new Value(CARD_INDEXES.NONE);
    this.valueToPushFirst = new Value(CARD_INDEXES.NONE);
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
        // return;
        if (forward) {
          const {
            objToBeUpdatedForRightSwipe,
            currentProfileIndex
          } = this.state;
          const lastObj = data[currentProfileIndex + 3];

          const targetObj =
            currentProfileIndex === 0
              ? "none"
              : objToBeUpdatedForRightSwipe === CARD_INDEXES.FIRST
              ? "firstObj"
              : objToBeUpdatedForRightSwipe === CARD_INDEXES.SECOND
              ? "secondObj"
              : objToBeUpdatedForRightSwipe === CARD_INDEXES.THIRD
              ? "thirdObj"
              : "fourthObj";

          // alert(
          //   " target is  " +
          //     currentProfileIndex +
          //     " " +
          //     data[currentProfileIndex + 3] +
          //     " " +
          //     JSON.stringify(lastObj)
          // );

          // return;

          this.setState(
            {
              [targetObj]: lastObj
            },
            () => {
              const { firstObj, secondObj, thirdObj, fourthObj } = this.state;

              // alert(
              //   " target is " +
              //     JSON.stringify({
              //       firstObj,
              //       secondObj,
              //       thirdObj,
              //       fourthObj
              //     })
              // );
            }
          );
        } else {
          const {
            objToBeUpdatedForLeftSwipe,
            secondObj,
            thirdObj,
            fourthObj
          } = this.state;
          const firstObj = this.props.data[currentProfileIndex - 2];
          const targetObj =
            objToBeUpdatedForLeftSwipe === 0
              ? "firstObj"
              : objToBeUpdatedForLeftSwipe === 1
              ? "secondObj"
              : objToBeUpdatedForLeftSwipe === 2
              ? "thirdObj"
              : "fourthObj";
          // alert(" to be updated is " + JSON.stringify({ firstObj }));
          this.setState({
            [targetObj]: firstObj
          });
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
    const prevMultiplier = -2;
    const nextMultiplier = 1;
    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.backwardComplete, 1), [
              set(this.animState, 0),
              set(this.preventEnd, 0),

              set(this.backwardComplete, 0)
            ]),
            cond(eq(this.forwardComplete, 1), [
              set(this.animState, 0),
              set(this.preventEnd, 0),
              cond(eq(this.valueToPushLast, CARD_INDEXES.FIRST), [
                set(this.firstCardTransX, nextMultiplier * width),
                set(this.firstCardSafeX, nextMultiplier * width)
              ]),
              cond(eq(this.valueToPushLast, CARD_INDEXES.SECOND), [
                set(this.secondCardTransX, nextMultiplier * width),
                set(this.secondCardSafeX, nextMultiplier * width)
              ]),
              cond(eq(this.valueToPushLast, CARD_INDEXES.THIRD), [
                set(this.thirdCardTransX, nextMultiplier * width),
                set(this.thirdCardSafeX, nextMultiplier * width)
              ]),
              cond(eq(this.valueToPushLast, CARD_INDEXES.FOURTH), [
                set(this.fourthCardTransX, nextMultiplier * width),
                set(this.fourthCardSafeX, nextMultiplier * width)
              ]),
              call([], () => {
                const {
                  currentProfileIndex,
                  currentInViewPort,
                  objToBeUpdatedForRightSwipe
                } = this.state;

                if (
                  this.state.objToBeUpdatedForRightSwipe === CARD_INDEXES.NONE
                ) {
                } else {
                  this.valueToPushLast.setValue(
                    this.state.objToBeUpdatedForRightSwipe
                  );
                }
                this.setState(
                  {
                    currentProfileIndex: currentProfileIndex + 1,
                    currentInViewPort:
                      currentInViewPort >= 0
                        ? currentInViewPort === 3
                          ? 0
                          : currentInViewPort < 3
                          ? currentInViewPort + 1
                          : 0
                        : 0,

                    objToBeUpdatedForRightSwipe: currentInViewPort,
                    objToBeUpdatedForLeftSwipe: currentInViewPort + 2
                  },
                  () => {
                    if (this.state.currentProfileIndex !== 0) {
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
              cond(eq(this.valueToPushFirst, CARD_INDEXES.FIRST), [
                set(this.firstCardTransX, prevMultiplier * width),
                set(this.firstCardSafeX, prevMultiplier * width)
              ]),
              cond(eq(this.valueToPushFirst, CARD_INDEXES.SECOND), [
                set(this.secondCardTransX, prevMultiplier * width),
                set(this.secondCardSafeX, prevMultiplier * width)
              ]),
              cond(eq(this.valueToPushFirst, CARD_INDEXES.THIRD), [
                set(this.thirdCardTransX, prevMultiplier * width),
                set(this.thirdCardSafeX, prevMultiplier * width)
              ]),
              cond(eq(this.valueToPushFirst, CARD_INDEXES.FOURTH), [
                set(this.fourthCardTransX, prevMultiplier * width),
                set(this.fourthCardSafeX, prevMultiplier * width)
              ]),
              call([], () => {
                if (this.state.currentProfileIndex === 0 && false) {
                  alert(" cant move any backward this is initial position");
                } else if (
                  // this.state.availablePrevCard === -1 &&
                  false
                ) {
                  alert(" not available ");
                }

                // if (this.state.availablePrevCard % 2 === 0)
                else {
                  this.props.callBack({
                    oldIndex: this.state.currentProfileIndex,
                    newIndex: 1,
                    continue: () => {
                      requestAnimationFrame(() => {
                        const {
                          currentInViewPort,
                          currentProfileIndex,
                          objToBeUpdatedForLeftSwipe,
                          objToBeUpdatedForRightSwipe
                        } = this.state;

                        alert(
                          " before push to first " +
                            this.state.objToBeUpdatedForLeftSwipe
                        );
                        this.valueToPushFirst.setValue(
                          objToBeUpdatedForLeftSwipe
                        );
                        this.setState({
                          currentProfileIndex: currentProfileIndex - 1,
                          currentInViewPort:
                            currentInViewPort === 0
                              ? 3
                              : currentInViewPort <= 3
                              ? currentInViewPort - 1
                              : 3,

                          objToBeUpdatedForLeftSwipe: currentInViewPort,
                          objToBeUpdatedForRightSwipe: currentInViewPort - 1
                        });

                        this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                      });
                    },
                    renable: () => this.callBackInProgress.setValue(0)
                  });
                }
              }),
              set(this.backWardCallbackComplete, 0)
            ])
          ])
        }
      </A.Code>
    );
  };

  renderAnimationsCode = () => {
    const nextTransX = sub(0, width);
    const prevTrans = add(0, width);
    const setAllCardsEndToSafe = (completeNode: A.Adaptable<any>) => [
      set(
        this.firstCardTransX,
        runTiming({
          completeNode: completeNode,
          value: this.firstCardTransX,
          dest: this.firstCardSafeX,
          safeX: this.firstCardSafeX
        })
      ),
      set(
        this.secondCardTransX,
        runTiming({
          completeNode: new Value(0),
          value: this.secondCardTransX,
          dest: this.secondCardSafeX,
          safeX: this.secondCardSafeX
        })
      ),
      set(
        this.thirdCardTransX,
        runTiming({
          completeNode: new Value(0),
          value: this.thirdCardTransX,
          dest: this.thirdCardSafeX,
          safeX: this.thirdCardSafeX
        })
      ),
      set(
        this.fourthCardTransX,
        runTiming({
          completeNode: new Value(0),
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
                  value: this.firstCardTransX,
                  dest: add(this.firstCardSafeX, nextTransX),
                  safeX: this.firstCardSafeX,
                  completeNode: this.forwardComplete
                })
              ),
              set(
                this.secondCardTransX,
                runTiming({
                  value: this.secondCardTransX,
                  dest: add(this.secondCardSafeX, nextTransX),
                  safeX: this.secondCardSafeX,
                  completeNode: new Value(0)
                })
              ),
              set(
                this.thirdCardTransX,
                runTiming({
                  value: this.thirdCardTransX,
                  dest: add(this.thirdCardSafeX, nextTransX),
                  safeX: this.thirdCardSafeX,
                  completeNode: new Value(0)
                })
              ),
              set(
                this.fourthCardTransX,
                runTiming({
                  value: this.fourthCardTransX,
                  dest: add(this.fourthCardSafeX, nextTransX),
                  safeX: this.fourthCardSafeX,
                  completeNode: new Value(0)
                })
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_BACKWARD), [
              set(
                this.firstCardTransX,
                runTiming({
                  value: this.firstCardTransX,
                  dest: sub(this.firstCardSafeX, nextTransX),
                  safeX: this.firstCardSafeX,
                  completeNode: this.backwardComplete
                })
              ),
              set(
                this.secondCardTransX,
                runTiming({
                  value: this.secondCardTransX,
                  dest: sub(this.secondCardSafeX, nextTransX),
                  safeX: this.secondCardSafeX,
                  completeNode: new Value(0)
                })
              ),
              set(
                this.thirdCardTransX,
                runTiming({
                  value: this.thirdCardTransX,
                  dest: sub(this.thirdCardSafeX, nextTransX),
                  safeX: this.thirdCardSafeX,
                  completeNode: new Value(0)
                })
              ),
              set(
                this.fourthCardTransX,
                runTiming({
                  value: this.fourthCardTransX,
                  dest: sub(this.fourthCardSafeX, nextTransX),
                  safeX: this.fourthCardSafeX,
                  completeNode: new Value(0)
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
                    cond(
                      and(
                        greaterOrEq(this.dragX, DRAG_THRESHOLD),
                        eq(this.callBackInProgress, 0)
                      ),

                      [
                        set(this.preventEnd, 1),

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
    const arr = new Array(4);
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
              {/*// <ReText text={concat("", this.panState)} />*/}
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
                    paddingVertical: 16,

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
                    paddingVertical: 24,

                    transform: [{ translateX: this.thirdCardTransX }]
                  }}
                >
                  {renderItem({ item: thirdObj, index: 2 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    backgroundColor: "orange",
                    paddingVertical: 32,

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

{
}
//19q65a0431

export default ReOneStepCaurosel;
