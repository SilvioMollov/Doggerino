import React, { Component } from "react";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../UI/Spinner/Spinner";
import "./Chat.css";

export class Chat extends Component {
  state = {
    message: "",
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
  };

  componentDidMount() {
    const {
      onFetchMatches,
      onFetchChatData,
      match: { params },
    } = this.props;

    const { token, userId } = this.state;

    onFetchMatches(userId, token);

    onFetchChatData(token, userId, params.id);
    this.updateChatData();
  }

  componentDidUpdate(prevProps) {
    const {
      onMessagedUser,
      matches,
      match: { params },
    } = this.props;

    if (prevProps.matches.length && this.props.matches !== prevProps.matches) {
      onMessagedUser(params.id, matches);
    }
  }

  updateChatData = () => {
    const {
      onFetchChatData,
      match: { params },
    } = this.props;

    const { token, userId } = this.state;

    this.timerId = setInterval(() => {
      onFetchChatData(token, userId, params.id);
    }, 7000);
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    const {
      onPostMessage,
      messagedUser,
      match: { params },
    } = this.props;

    const { message, token, userId } = this.state;

    if (messagedUser.userId) {
      onPostMessage(token, userId, params.id, message);
      this.setState({ message: "" });
    }
  };

  onChangeHandler = (e) => {
    this.setState({ message: e.target.value });
  };

  onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      this.onSubmitHandler(e);
    }
  };

  componentWillUnmount() {
    this.props.onClearState();
    clearInterval(this.timerId);
  }

  scrollToBottom = (element) => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  render() {
    const { messagedUser, loading, chatData, matches } = this.props;

    let chat = null;

    if (!loading && matches.length) {
      chat = (
        <div className="Chat">
          <div>User: {messagedUser.firstName} </div>
          <form onSubmit={this.onSubmitHandler} className="Chat-Input">
            <div className="Chat-Log">
              {chatData.map((message) => {
                return (
                  <div key={message.currentDate} ref={this.scrollToBottom}>
                    <p className={message.isSender ? "Sender" : "Reciever"}>
                      {message.message}
                    </p>
                    <p
                      className={
                        message.isSender
                          ? "Message-Date-Sender"
                          : "Message-Date-Reciever"
                      }
                    >
                      {message.formatedDate}
                    </p>
                  </div>
                );
              })}
            </div>

            <input
              className="Input"
              onChange={this.onChangeHandler}
              onKeyPress={this.onKeyPressHandler}
              value={this.state.message}
            ></input>

            <button type="submit" className="Submit">
              Send
            </button>
          </form>
        </div>
      );
    } else {
      chat = <Spinner></Spinner>;
    }

    return <div>{chat}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    messagedUser: state.chat.messagedUser,
    chatData: state.chat.chatData,
    loading: state.chat.loading,
    matches: state.matches.matches,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMatches: (userId, token) =>
      dispatch(actions.fetchMatches(userId, token)),
    onPostMessage: (token, userId, messagedUserId, message) =>
      dispatch(actions.postChatMessage(token, userId, messagedUserId, message)),
    onClearState: () => dispatch(actions.clearChatState()),
    onFetchChatData: (token, userId, messagedUserId) =>
      dispatch(actions.fetchChatData(token, userId, messagedUserId)),
    onMessagedUser: (user, matches) =>
      dispatch(actions.messagedUser(user, matches)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
