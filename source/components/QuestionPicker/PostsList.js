import React, { Component } from "react";
import _isEqual from "lodash/isEqual";
import _sortBy from "lodash/sortBy";
import QuestionItem from "./Question.item";
import { connect } from "react-redux";

class PostsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      init: true,
      globalPosts: []
    };
  }

  componentDidMount = () => {
    const { contentQuestions, gameId } = this.props;
    this.setState({ globalPosts: contentQuestions[gameId] });
  };

  // componentDidMount = () => {
  //   const { questions } = this.props;
  //   const sortedPosts = _sortBy(questions || [], ["postOrder"]);
  //   const onlyPosts = sortedPosts.filter(i => i.postId);
  //   this.setState(
  //     {
  //       posts: onlyPosts
  //     },
  //     () => {
  //       console.log(
  //         " called will did mount  >>> postslist ",
  //         this.props.questions,
  //         this.state
  //       );
  //     }
  //   );
  // };
  componentWillReceiveProps = nextProps => {
    const { props: prevProps } = this;
    const { globalPosts } = this.state;
    // console.log(
    //   " componentWillReceiveProps args are ",
    //   nextProps.contentQuestions[this.props.gameId],
    //   prevProps.contentQuestions[this.props.gameId]
    // );

    if (
      this.state.init === true ||
      !_isEqual(nextProps.contentQuestions[this.props.gameId], globalPosts)
    ) {
      const questions = nextProps.contentQuestions[nextProps.gameId];
      const sortedPosts = _sortBy(questions || [], ["postOrder"]);
      const onlyPosts = sortedPosts.filter(i => i.postId);
      this.setState({
        posts: onlyPosts,
        init: false,
        globalPosts: nextProps.contentQuestions[this.state.gameId]
      });
    }
  };
  // shouldComponentUpdate = nextProps => {
  //   const { props: prevProps } = this;
  //   return !_isEqual(nextProps.contentQuestions, prevProps.contentQuestions);
  // };
  // componentDidUpdate = prevProps => {
  //   const { props: nextProps } = this;

  //   if (!_isEqual(nextProps.questions, prevProps.questions)) {
  //     const sortedPosts = _sortBy(nextProps.questions || [], ["postOrder"]);
  //     const onlyPosts = sortedPosts.filter(i => i.postId);
  //     this.setState(
  //       {
  //         posts: onlyPosts,
  //         init: false
  //       },
  //       () => {
  //         console.log(
  //           " called will receiveProps >>> postslist ",
  //           nextProps.questions,
  //           prevProps.questions
  //         );
  //       }
  //     );
  //   }
  // };
  render() {
    const { posts } = this.state;
    const {
      pickQuestion,
      postObj,
      // isFavourite={inFav}
      onReplaceGame,
      onFavRemoved,
      onFavExeeced,
      closeOptionViewMode,
      // question={question}
      selectedList,
      fromChatWindow,
      // postId={postId}
      gameId,
      // redHeart={favId ? true : false}
      pickOption,
      // postedOption={question.option}
      showActive,
      showIconRow,
      showReplaceButton,
      showDeleteIcon,
      contentQuestions
    } = this.props;
    return (
      <>
        {posts.map((question, postIndex) => {
          // if (!question.postId) {
          //   return null;
          // }
          const { postId, favId } = question;

          if (
            question.question !== "TWO_TRUTHS_AND_A_LIE" &&
            question.gameId.value !== "THE_PERFECT_GIF"
          ) {
            return (
              <QuestionItem
                key={postIndex}
                postObj={postObj}
                // isFavourite={inFav}
                onReplaceGame={onReplaceGame}
                onFavRemoved={onFavRemoved}
                onFavExeeced={onFavExeeced}
                closeOptionViewMode={closeOptionViewMode}
                question={question}
                fromChatWindow={fromChatWindow}
                postId={postId}
                gameId={gameId}
                redHeart={favId ? true : false}
                pickOption={pickOption}
                postedOption={question.option}
                showActive={showActive}
                showIconRow={showIconRow}
                showReplaceButton={showReplaceButton}
                showDeleteIcon={showDeleteIcon}
              />
            );
          }
        })}
      </>
    );
  }
}

const mapState = state => {
  return {
    contentQuestions: state.content.questions
  };
};

const mapDispatch = dispatch => {
  return {};
};
export default connect(mapState, mapDispatch)(PostsList);
