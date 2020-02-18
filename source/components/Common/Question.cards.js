import React, { Component } from "react";
import { View } from "react-native";
import ResponseScreen from "./Response.screen";
import { DeviceWidth, DeviceHeight } from "../../config/Device";
import { Bar as ProgressBar } from "react-native-progress";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as TriggerActions from "../../redux/actions/Trigger.actions";
import * as QuestionActions from "../../redux/actions/Question.action";
import * as ResponseActions from "../../redux/actions/Response.action";
var interval;

class QuestionCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 0,
      currentValue: 0
    };
    this.scrollMethod = this.scrollMethod.bind(this);
  }

  scrollMethod(x) {
    if (x < 0) {
      this.setState({ currentId: 0 });
    } else {
      this.setState({ currentId: x });
    }
  }

  closeScreen = () => {
    this.props.closeLightBox();
    this.clearLocalInterval();
  };

  startTimer = () => {
    interval = setInterval(() => {
      this.setState(prevState => {
        return {
          currentValue: prevState.currentValue + 0.01
        };
      });
    }, 50);
  };

  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    let CurrentValue = parseInt(this.state.currentValue);
    let prevCurrentValue = parseInt(prevState.currentValue);
    if (CurrentValue > prevCurrentValue) {
      console.log(
        "CurrentValue > prevCurrentValue ",
        CurrentValue,
        prevCurrentValue,
        this.props.posts.length
      );
      if (CurrentValue < this.props.posts.length) {
        this.scrollMethod(CurrentValue);
      } else {
        this.closeScreen();
      }
    }
  };

  componentDidMount = () => {
    this.startTimer();
  };

  componentWillUnmount = () => {
    this.setState({ currentId: 0, currentValue: 0 });
  };

  clearLocalInterval = () => {
    clearInterval(interval);
  };

  resumeInterval = () => {
    this.startTimer();
  };

  setCurrentProgressValue = val => {
    if (val < 0) {
      console.log("val getting here is:A ", val);
      this.setState({ currentValue: 0 });
    } else {
      console.log("val getting here is:B ", val);

      this.setState({ currentValue: val });
    }
  };

  pushResponse = response => {
    let { storeResponse, posts } = this.props;
    let { currentId } = this.state;
    storeResponse(response, posts[currentId]);
  };

  render() {
    const {
      posts,
      fromSurfing,
      fromChatWindow,
      answeredBy,
      responses,
      msgId
    } = this.props;
    let { currentValue, currentId } = this.state;
    let singleQuestion = posts[currentId];

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            top: 20,
            zIndex: 9999
          }}
        >
          {posts.map((post, id) => {
            return (
              <ProgressBar
                animated={true}
                style={{
                  marginTop: 0,
                  marginHorizontal: 1.5
                }}
                key={id}
                color="#fff"
                height={3}
                progress={currentValue - id}
                width={DeviceWidth / posts.length - 2}
                borderRadius={10}
                unfilledColor={"rgba(201, 201, 201,0.3)"}
                borderWidth={0}
              />
            );
          })}
        </View>

        <ResponseScreen
          answeredBy={answeredBy}
          prevResponses={responses}
          pushResponse={this.pushResponse}
          index={currentId}
          setCurrentProgressValue={this.setCurrentProgressValue}
          msgId={msgId}
          clearLocalInterval={this.clearLocalInterval}
          resumeInterval={this.resumeInterval}
          totalCards={posts.length}
          question={singleQuestion}
          scrollMethod={this.scrollMethod}
          closeQuestionsModal={this.closeScreen}
          fromChatWindow={fromChatWindow}
          fromSurfing={fromSurfing}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    sendResponseResult: state.questions.postResponseData,
    multipleResponses: state.response.getResponses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendResponse: bindActionCreators(QuestionActions.postResponse, dispatch),
    getMultipleResponses: bindActionCreators(
      ResponseActions.getMultipleResponses,
      dispatch
    ),
    fetchMyResponse: bindActionCreators(
      TriggerActions.fetchMyResponse,
      dispatch
    )
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionCards);
