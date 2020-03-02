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
  SpringUtils,
  neq
} = A;

const { width: w, height } = Dimensions.get("window");
const width = w * 0.8;
const gutter = 32;

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
      set(safeX, dest)
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
  fifthObj: any;
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
  FOURTH: 3,
  FIFTH: 4
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
  private fifthcardTransX: A.Adaptable<any>;
  private backwardComplete: A.Value<1 | 0>;
  private forwardComplete: A.Value<1 | 0>;

  private firstCardSafeX: A.Adaptable<any>;
  private secondCardSafeX: A.Adaptable<any>;
  private thirdCardSafeX: A.Adaptable<any>;
  private fourthCardSafeX: A.Adaptable<any>;
  private fifthCardSafeX: A.Adaptable<any>;
  private backWardCallbackComplete: any;
  private valueToPushLast: A.Value<number>;
  private valueToPushFirst: A.Value<number>;
  private shouldPushToLast: A.Value<number>;
  private shouldPushToFirst: A.Value<number>;
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
      fifthObj: null,
      objToBeUpdatedForRightSwipe: CARD_INDEXES.NONE,
      objToBeUpdatedForLeftSwipe: CARD_INDEXES.FIFTH,
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
    const fifthCardValue = 4 * width;
    this.firstCardTransX = new Value(firstCardValue);
    this.secondCardTransX = new Value(secondCardValue);
    this.thirdCardTransX = new Value(thirdCardValue);
    this.fourthCardTransX = new Value(fourthCardValue);
    this.fifthcardTransX = new Value(fifthCardValue);

    //recylers
    //safevalues

    this.firstCardSafeX = new Value(firstCardValue);
    this.secondCardSafeX = new Value(secondCardValue);
    this.thirdCardSafeX = new Value(thirdCardValue);
    this.fourthCardSafeX = new Value(fourthCardValue);
    this.fifthCardSafeX = new Value(fifthCardValue);
    //complete nodes
    this.forwardComplete = new Value(0);
    this.backwardComplete = new Value(0);
    this.backWardCallbackComplete = new Value(0);
    this.valueToPushLast = new Value(CARD_INDEXES.NONE);
    this.valueToPushFirst = new Value(CARD_INDEXES.NONE);

    //relocationEvalNodes

    this.shouldPushToLast = new Value(0);
    this.shouldPushToFirst = new Value(0);
  }

  reArrangeData = (initialRender?: boolean, forward?: boolean) => {
    // return
    requestAnimationFrame(() => {
      const { data, startIndex } = this.props;
      const { currentProfileIndex } = this.state;

      if (initialRender) {
        const prevObj = data[0];
        const currentObj = data[1];
        const nextObj = data[2];
        const fourthObj = data[3];
        const fifthObj = data[4];

        this.setState({
          firstObj: prevObj,
          secondObj: currentObj,
          thirdObj: nextObj,
          fourthObj,
          fifthObj
          // data: arr
        });
      } else {
        return;
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
              : objToBeUpdatedForRightSwipe === CARD_INDEXES.FOURTH
              ? "fourthObj"
              : "fifthObj";

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

  renderCardPushingCode = () => {
    const prevMultiplier = -2;
    const nextMultiplier = 2;

    const nextDestination = nextMultiplier * width;
    const prevDestination = prevMultiplier * width;
    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.shouldPushToLast, 1), [
              set(this.shouldPushToLast, 0),
              // set(this.animState, ANIM_STATES.N0_ANIMATION),
              // call([], () => alert(" init ")),

              cond(eq(this.valueToPushLast, 0), [
                set(this.firstCardTransX, nextDestination),
                set(this.firstCardSafeX, nextDestination),
                set(this.forwardComplete, 0)
                // set(this.shouldPushToLast, 0)
              ]),
              cond(eq(this.valueToPushLast, 1), [
                set(this.secondCardTransX, nextDestination),
                set(this.secondCardSafeX, nextDestination),
                set(this.forwardComplete, 0)
                // set(this.shouldPushToLast, 0)
              ]),
              cond(eq(this.valueToPushLast, 2), [
                set(this.thirdCardTransX, nextDestination),
                set(this.thirdCardSafeX, nextDestination),
                set(this.forwardComplete, 0)
                // set(this.shouldPushToLast, 0)
              ]),
              cond(eq(this.valueToPushLast, 3), [
                set(this.fourthCardTransX, nextDestination),
                set(this.fourthCardSafeX, nextDestination),
                set(this.forwardComplete, 0)
                // set(this.shouldPushToLast, 0)
              ]),
              cond(eq(this.valueToPushLast, 4), [
                set(this.fifthcardTransX, nextDestination),
                set(this.fifthCardSafeX, nextDestination),
                set(this.forwardComplete, 0)
                // set(this.shouldPushToLast, 0)
              ]),
              cond(eq(this.valueToPushLast, CARD_INDEXES.NONE), [
                set(this.forwardComplete, 0)
                // set(this.shouldPushToLast, 0)
              ]),

              // set(this.animState, ANIM_STATES.N0_ANIMATION),
              set(this.shouldPushToLast, 0)
            ]),
            cond(eq(this.shouldPushToFirst, 1), [
              cond(eq(this.valueToPushFirst, 0), [
                set(this.firstCardTransX, prevDestination),
                set(this.firstCardSafeX, prevDestination),
                set(this.backWardCallbackComplete, 0)
              ]),
              cond(eq(this.valueToPushFirst, 1), [
                set(this.secondCardTransX, prevDestination),
                set(this.secondCardSafeX, prevDestination),
                set(this.backWardCallbackComplete, 0)
              ]),
              cond(eq(this.valueToPushFirst, 2), [
                set(this.thirdCardTransX, prevDestination),
                set(this.thirdCardSafeX, prevDestination),
                set(this.backWardCallbackComplete, 0)
              ]),
              cond(eq(this.valueToPushFirst, 3), [
                set(this.fourthCardTransX, prevDestination),
                set(this.fourthCardSafeX, prevDestination),
                set(this.backWardCallbackComplete, 0)
              ]),
              cond(eq(this.valueToPushFirst, 4), [
                set(this.fifthcardTransX, prevDestination),
                set(this.fifthCardSafeX, prevDestination),
                set(this.backWardCallbackComplete, 0)
              ]),
              cond(eq(this.valueToPushFirst, CARD_INDEXES.NONE), [
                set(this.backWardCallbackComplete, 0)
              ]),
              set(this.shouldPushToFirst, 0)
            ])
          ])
        }
      </A.Code>
    );
  };
  renderCallbackCode = () => {
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
              call([], () => {
                requestAnimationFrame(() => {
                  this.forwardComplete.setValue(0);

                  // alert("val is " + 1);
                  //reason first card is dissapearing
                  this.valueToPushLast.setValue(
                    this.state.currentProfileIndex > 0
                      ? this.state.objToBeUpdatedForRightSwipe
                      : -1
                  );

                  this.shouldPushToLast.setValue(1);
                  const { currentProfileIndex, currentInViewPort } = this.state;
                  this.setState(
                    {
                      currentProfileIndex: currentProfileIndex + 1,
                      currentInViewPort:
                        currentInViewPort >= 0
                          ? currentInViewPort === 4
                            ? 0
                            : currentInViewPort < 4
                            ? currentInViewPort + 1
                            : 0
                          : 0,

                      objToBeUpdatedForRightSwipe:
                        currentProfileIndex > 0
                          ? getObjToBeUpdatedForRightSwipe(currentInViewPort)
                          : -1,
                      objToBeUpdatedForLeftSwipe:
                        currentProfileIndex > 0
                          ? getObjToBeUpdatedForLeftSwipe(currentInViewPort)
                          : -1
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
                });
              }),
              // cond(eq(this.valueToPushLast, 0), [
              //   set(this.firstCardTransX, nextDestination),
              //   set(this.firstCardSafeX, nextDestination),
              //   set(this.forwardComplete, 0)
              //   // set(this.shouldPushToLast, 0)
              // ]),
              // cond(eq(this.valueToPushLast, 1), [
              //   set(this.secondCardTransX, nextDestination),
              //   set(this.secondCardSafeX, nextDestination),
              //   set(this.forwardComplete, 0)
              //   // set(this.shouldPushToLast, 0)
              // ]),
              // cond(eq(this.valueToPushLast, 2), [
              //   set(this.thirdCardTransX, nextDestination),
              //   set(this.thirdCardSafeX, nextDestination),
              //   set(this.forwardComplete, 0)
              //   // set(this.shouldPushToLast, 0)
              // ]),
              // cond(eq(this.valueToPushLast, 3), [
              //   set(this.fourthCardTransX, nextDestination),
              //   set(this.fourthCardSafeX, nextDestination),
              //   set(this.forwardComplete, 0)
              //   // set(this.shouldPushToLast, 0)
              // ]),
              // cond(eq(this.valueToPushLast, 4), [
              //   set(this.fifthcardTransX, nextDestination),
              //   set(this.fifthCardSafeX, nextDestination),
              //   set(this.forwardComplete, 0)
              //   // set(this.shouldPushToLast, 0)
              // ]),
              // cond(eq(this.valueToPushLast, CARD_INDEXES.NONE), [
              //   set(this.forwardComplete, 0)
              //   // set(this.shouldPushToLast, 0)
              // ]),
              // set(this.shouldPushToLast, 1),
              set(this.animState, ANIM_STATES.N0_ANIMATION),
              set(this.preventEnd, 0)
              // set(this.forwardComplete, 0)
            ]),
            cond(eq(this.backWardCallbackComplete, 1), [
              call([], () => {
                if (this.state.currentProfileIndex === 0 && false) {
                  alert(" cant move any backward this is initial position");
                } else if (false) {
                  alert(" not available ");
                } else {
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

                        this.valueToPushLast.setValue(
                          objToBeUpdatedForRightSwipe
                        );
                        this.setState(
                          {
                            currentProfileIndex: currentProfileIndex - 1,
                            currentInViewPort:
                              currentInViewPort === 0
                                ? 4
                                : currentInViewPort <= 4
                                ? currentInViewPort - 1
                                : 4,
                            objToBeUpdatedForLeftSwipe: getObjToBeUpdatedForLeftSwipe(
                              currentInViewPort
                            ),
                            objToBeUpdatedForRightSwipe: getObjToBeUpdatedForRightSwipe(
                              currentInViewPort
                            )
                          },
                          () => {}
                        );
                        this.animState.setValue(ANIM_STATES.MOVE_BACKWARD);
                      });
                    },
                    renable: () => {
                      this.animState.setValue(ANIM_STATES.N0_ANIMATION);
                      this.backWardCallbackComplete.setValue(0);
                      this.callBackInProgress.setValue(0);
                      this.preventEnd.setValue(0);
                    }
                  });
                }
              }),
              set(this.animState, ANIM_STATES.N0_ANIMATION),
              set(this.preventEnd, 0),
              set(this.backWardCallbackComplete, 0)
            ])
          ])
        }
      </A.Code>
    );
  };

  renderAnimationsCode = () => {
    const nextTransX = width;
    const values = [
      { val: this.firstCardTransX, safe: this.firstCardSafeX },
      { val: this.secondCardTransX, safe: this.secondCardSafeX },
      { val: this.thirdCardTransX, safe: this.thirdCardSafeX },
      { val: this.fourthCardTransX, safe: this.fourthCardSafeX },
      { val: this.fifthcardTransX, safe: this.fifthCardSafeX }
    ];
    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.animState, ANIM_STATES.N0_ANIMATION), 0, 0),
            cond(eq(this.animState, ANIM_STATES.MOVE_FORWARD), [
              cond(eq(this.forwardComplete, 0), [
                values.map(({ val, safe }, index) =>
                  set(
                    val,
                    runTiming({
                      value: val,
                      dest: sub(safe, width),
                      safeX: safe,
                      completeNode:
                        index === 0 ? this.forwardComplete : new Value(0)
                    })
                  )
                )
              ])
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_BACKWARD), [
              values.map(({ val, safe }, index) =>
                set(
                  val,
                  runTiming({
                    value: val,
                    dest: add(safe, nextTransX),
                    safeX: safe,
                    completeNode:
                      index === 0 ? this.backwardComplete : new Value(0)
                  })
                )
              )
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE), [
              values.map(({ val, safe }) =>
                set(
                  val,
                  runTiming({
                    value: val,
                    dest: safe,
                    safeX: safe,
                    completeNode: new Value(0)
                  })
                )
              ),
              set(this.callBackInProgress, 0),
              set(this.preventEnd, 0)
            ]),
            cond(eq(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK), [
              values.map(({ val, safe }) =>
                set(
                  val,
                  runTiming({
                    value: val,
                    dest: safe,
                    safeX: safe,
                    completeNode: this.backWardCallbackComplete
                  })
                )
              )
            ])
            // ])
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
      set(this.fourthCardTransX, add(this.fourthCardSafeX, this.dragX)),
      set(this.fifthcardTransX, add(this.fifthCardSafeX, this.dragX))
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
                  [...setAllCardsActive, 0],
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
                  )
                ]
              )
            ])
          ])
        }
      </A.Code>
    );
  };
  render() {
    const { renderItem } = this.props;
    const { firstObj, secondObj, thirdObj, fourthObj, fifthObj } = this.state;
    const arr = new Array(4);
    return (
      <>
        {this.renderEventsCode()}
        {this.renderAnimationsCode()}
        {this.renderCallbackCode()}
        {this.renderCardPushingCode()}
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
              <View
                style={{
                  flexDirection: "row",
                  width,
                  justifyContent: "space-between"
                }}
              >
                <ReText
                  text={concat(
                    "first ",
                    round(divide(this.firstCardTransX, width))
                  )}
                />
                <ReText
                  text={concat(
                    " second ",
                    round(divide(this.secondCardTransX, width))
                  )}
                />
                <ReText
                  text={concat(
                    "third ",
                    round(divide(this.thirdCardTransX, width))
                  )}
                />
                <ReText
                  text={concat(
                    " fourth ",
                    round(divide(this.fourthCardTransX, width))
                  )}
                />
                <ReText
                  text={concat(
                    " fifth ",
                    round(divide(this.fifthcardTransX, width))
                  )}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width,
                  justifyContent: "space-around"
                }}
              >
                {/*<ReText text={concat("animState is    ", this.animState)} />
                <ReText
                  text={concat(
                    "shouldPushToLast  is    ",
                    this.shouldPushToLast
                  )}
                />*/}
              </View>

              <Text> {this.state.objToBeUpdatedForLeftSwipe} </Text>
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
                    left: 10,
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
                    left: 10,

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
                    left: 10,

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
                    left: 10,

                    transform: [{ translateX: this.fourthCardTransX }]
                  }}
                >
                  {renderItem({ item: fourthObj, index: 3 })}
                </A.View>
                <A.View
                  style={{
                    position: "absolute",
                    backgroundColor: "#62B6CB",
                    paddingBottom: 40,
                    left: 10,

                    transform: [{ translateX: this.fifthcardTransX }]
                  }}
                >
                  {renderItem({ item: fifthObj, index: 0 })}
                </A.View>
              </A.View>
            </A.View>
          </PanGestureHandler>
        </View>
      </>
    );
  }
}

function getNextCurrentInViewPort(val) {
  if (val > 4) {
    throw new Error("value cant exeeced 4 ");
  }
  return val === 4 ? 0 : val + 1;
  // switch (val) {
  //   case 0:
  //     return 1;
  //   case 1:
  //     return 2;
  //   case 2:
  //     return 3;
  //   case 3:
  //     return 4;
  //   case 4:
  //     return 0;
  // }
}

function getPrevCurrentInViewPort(val) {
  if (val < 0) {
    throw new Error("value cant go beneath 0 ");
  }
  return val === 0 ? 4 : val - 1;
  // switch (val) {
  //   case 0:
  //     return 1;
  //   case 1:
  //     return 2;
  //   case 2:
  //     return 3;
  //   case 3:
  //     return 4;
  //   case 4:
  //     return 0;
  // }
}

function getObjToBeUpdatedForLeftSwipe(currentInViewPort) {
  let result;

  switch (currentInViewPort) {
    case 0:
      result = 2;
      break;
    case 1:
      result = 3;
      break;
    case 2:
      result = 4;
      break;
    case 3:
      result = 0;
      break;
    case 4:
      result = 1;
      break;
  }
  // alert(" input is " + currentInViewPort + " res is " + result);

  return result;
}

function getObjToBeUpdatedForRightSwipe(currentInViewPort) {
  let result;
  switch (currentInViewPort) {
    case 0:
      result = 4;
      break;
    case 1:
      result = 0;
      break;
    case 2:
      result = 1;
      break;
    case 3:
      result = 2;
      break;
    case 4:
      result = 3;
      break;
  }

  return result;
}
export default ReOneStepCaurosel;
