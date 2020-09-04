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
    const { messagedUser } = this.props;
    const { token, userId } = this.state;

    this.props.onFetchChatData(token, userId, messagedUser.userId);
  }

  onSubmitHandler = (e) => {
    e.preventDefault();
    const { onPostMessage, messagedUser } = this.props;
    const { message, token, userId } = this.state;

    if (messagedUser.userId) {
      onPostMessage(token, userId, messagedUser.userId, message);
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
  }

  render() {
    const { messagedUser, loading, chatData } = this.props;
    let chat = null;


    if (!loading) {
      chat = (
        <div className="Chat">
          <div>User: {messagedUser.firstName} </div>
          <form onSubmit={this.onSubmitHandler} className="Chat-Input">
            <div className="Chat-Log">
              {chatData.map((message) => {
                return <p key={message.formatedDate} className={message.isSender ? "Sender" : "Reciever"}>{message.message}</p>;
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPostMessage: (token, userId, messagedUserId, message) =>
      dispatch(actions.postChatMessage(token, userId, messagedUserId, message)),
    onClearState: () => dispatch(actions.clearChatState()),
    onFetchChatData: (token, userId, messagedUserId) =>
      dispatch(actions.fetchChatData(token, userId, messagedUserId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);