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

function withActiveOffsets({ values, dragX }) {
  const valueSetters = values.map(val => {
    const { safeOffset, activeOffset } = val;
    return;
    set(activeOffset, add(safeOffset, dragX));
  });
  return block([...valueSetters]);
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

class VirtualCaurosel extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      firstObj: null,
      secondObj: null,
      thirdObj: null,
      fourthObj: null
    };
    this.dragX = new A.Value(0);
    this.velocityX = new A.Value(0);
    this.panState = new A.Value(State.UNDETERMINED);

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
    //event blocks
    this.callBackInProgress = new Value(0);
    this.preventEnd = new Value(0);
    this.backwardComplete = new Value(0);
    this.forwardComplete = new Value(0);
    this.backWardCallbackComplete = new Value(0);
    //ANIM_STATES
    this.animState = new Value();

    this.gestureEvent = A.event([
      {
        nativeEvent: {
          translationX: this.dragX,
          velocityX: this.velocityX,
          state: this.panState
        }
      }
    ]);
  }

  componentDidMount = () => {
    const { data } = this.props;

    // alert(" this.length is " + JSON.stringify(Object.keys(firstCardTransX)));

    this.setState({
      fourthObj: data[3],
      thirdObj: data[2],
      secondObj: data[1],
      firstObj: data[0]
    });
  };
  renderHandlerCode = () => {
    const resetSafes = [
      set(this.firstCardSafeX, this.firstCardTransX),
      set(this.secondCardSafeX, this.secondCardTransX),
      set(this.thirdCardSafeX, this.thirdCardTransX),
      set(this.fourthCardSafeX, this.fourthCardTransX)
    ];
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

            cond(eq(this.panState, State.END), [
              cond(eq(this.preventEnd, 0), [
                cond(
                  lessThan(this.dragX, -1 * DRAG_THRESHOLD),
                  [set(this.animState, ANIM_STATES.MOVE_FORWARD)],

                  [
                    cond(
                      and(
                        eq(this.callBackInProgress, 0),
                        greaterThan(this.dragX, DRAG_THRESHOLD)
                      ),
                      [
                        set(this.animState, ANIM_STATES.MOVE_SAFE_WITH_CALLBACK)
                      ],
                      [set(this.animState, ANIM_STATES.MOVE_SAFE)]
                      // [set(this.animState, ANIM_STATES.MOVE_BACKWARD)],
                      // [set(this.animState, ANIM_STATES.MOVE_FORWARD)]
                    )
                  ]
                )
              ])

              // set(this.panState, State.UNDETERMINED)
            ])
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
  render() {
    const { firstObj, secondObj, thirdObj, fourthObj } = this.state;
    const { renderItem } = this.props;
    return (
      <>
        {this.renderHandlerCode()}
        {this.renderAnimationsCode()}
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
              <ReText text={concat("", this.firstCardTransX)} />
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

export default VirtualCaurosel;

//animation funcitons

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
