import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {
  layout: any;
}

interface IState {
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  showHighlight: boolean;
}

class Highlighter extends React.Component<IProps, IState> {
  private layout: any;
  constructor(props) {
    super(props);
    this.state = {
      layout: {
        x: null,
        y: null,
        width: null,
        height: null
      },
      showHighlight: false
    };
    this.layout = null;
  }
  open = () => {
    alert("hsoe");
    this.setState({
      showHighlight: !this.state.showHighlight
    });
  };
  render() {
    const { layout } = this.props;
    console.log(" layout given is ", layout);
    if (!layout) {
      return null;
    }
    return (
      <View
        style={{
          opacity: 1,
          top: layout.y,
          left: layout.x - 80,
          position: "absolute",
          width: 160,
          height: 48,
          zIndex: 200,
          backgroundColor: "#ededed",
          borderRadius: 10
        }}
      />
    );
  }
}

export default Highlighter;
