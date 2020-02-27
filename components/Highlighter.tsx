import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {
  content: string;
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
    const { content } = this.props;
    return (
      <>
        <Popup visible={this.state.showHighlight} layout={this.state.layout} />
        <TouchableOpacity
          style={{
            margin: 10,
            backgroundColor: "red",
            borderRadius: 10,
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={this.open}
          onLayout={e => {
            this.setState({
              layout: e.nativeEvent.layout
            });
          }}
        >
          <Text>{content}</Text>
        </TouchableOpacity>
      </>
    );
  }
}

export default Highlighter;

const Popup = ({ visible, layout }) => {
  const opacity = visible ? 1 : 0;
  return (
    <View
      style={{
        opacity: 1,
        top: layout.y,
        right: layout.x,
        position: "absolute",
        width: 160,
        height: 48,
        backgroundColor: "#ededed",
        borderRadius: 10
      }}
    />
  );
};
