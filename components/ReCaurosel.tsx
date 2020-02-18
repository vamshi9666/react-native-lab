import * as React from "react";
import { StyleProp, Dimensions, View, Text } from "react-native";
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
  GO_TO_SAFE: 2,
  MOVE_BACKWARD: 3
};
class ReCaurosel extends React.Component<IProps, IState> {
  static defaultProps = {
    currentIndex: 0
  };
  private initialPostion: any;
  private masterTranslateX: any;
  private gestureEvent: any;
  private safeX: any;
  private animState: any;
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
      currentProfileIndex: 0
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

  renderCode = () => {
    const nextTransX = sub(this.safeX, width);
    const prevTrans = add(this.safeX, width);

    return (
      <A.Code>
        {() =>
          block([
            cond(eq(this.panState, State.ACTIVE), [
              set(this.masterTranslateX, add(this.safeX, this.dragX))
            ]),
            cond(eq(this.panState, State.END), [
              cond(
                lessThan(this.dragX, -100),
                [set(this.animState, ANIM_STATES.MOVE_FORWARD)],

                [
                  cond(
                    greaterThan(this.dragX, 100),
                    [set(this.animState, ANIM_STATES.MOVE_BACKWARD)],
                    [set(this.animState, ANIM_STATES.GO_TO_SAFE)]
                  )
                ]
              )
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
            cond(eq(this.animState, ANIM_STATES.GO_TO_SAFE), [
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
            ])
          ])
        }
      </A.Code>
    );
  };
  render() {
    const { currentProfileIndex } = this.state;
    return (
      <>
        {this.renderCode()}

        <PanGestureHandler
          onHandlerStateChange={this.gestureEvent}
          onGestureEvent={this.gestureEvent}
        >
          <A.View
            style={{
              // backgroundColor: "red"
              justifyContent: "center",
              alignItems: "center"
            }}
          >
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

                left: 0,
                alignItems: "center",

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
                      width: width - 64,
                      height: 300,
                      backgroundColor: i % 2 === 0 ? "#c3c993" : "red",
                      marginHorizontal: 32,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20
                    }}
                  >
                    <Text>{i}</Text>
                  </View>
                );
              })}
            </A.View>
          </A.View>
        </PanGestureHandler>
      </>
    );
  }
}

//19q65a0431

export default ReCaurosel;