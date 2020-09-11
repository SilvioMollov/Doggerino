import React, { Component } from 'react';
import Match from '../Body/Matched/Match/Match';
import Spinner from '../UI/Spinner/Spinner';
import Modal from '../UI/Modal/Modal';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import './Admin.css';

export class Admin extends Component {
  state = {
    editing: false,
    editedUserState: {
      firstName: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      lastName: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      location: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
  };

  onClickHandler = (user) => {
    const { onSetEditedUser } = this.props;

    onSetEditedUser(user);

    this.setState({ editing: !this.state.editing });
  };

  onDeleteUserHandler = () => {
    const { allUsers, onDeleteUser, editedUser } = this.props;

    const objectArr = Object.entries(allUsers);
    const pickedUser = objectArr.find(([key, value]) =>
      Object.values(value).includes(editedUser.userId)
    );

    onDeleteUser(pickedUser, localStorage.getItem('token'));

    this.setState({ editing: false });

    for (let prop in this.state.editedUserState) {
      if (this.state.editedUserState[prop].touched) {
        this.setState((state) => {
          state.editedUserState[prop].value = '';
          state.editedUserState[prop].valid = false;
        });
      }
    }
  };

  onEditingCancelHandler = () => {
    this.setState({ editing: false });

    for (let prop in this.state.editedUserState) {
      if (this.state.editedUserState[prop].touched) {
        this.setState((state) => {
          state.editedUserState[prop].value = '';
          state.editedUserState[prop].valid = false;
        });
      }
    }

    console.log(this.state.editedUserState);
  };

  onEditConfirmHandler = () => {
    const { editedUserState } = this.state;
    const { allUsers, editedUser, onUpdateEditedUser } = this.props;

    const objectArr = Object.entries(allUsers);
    const pickedUser = objectArr.find(([key, value]) =>
      Object.values(value).includes(editedUser.userId)
    );

    let editedUserData = {};

    for (let prop in editedUserState) {
      if (editedUserState[prop].touched && editedUserState[prop].valid) {
        editedUserData = {
          ...editedUserData,
          [prop]: editedUserState[prop].value,
        };
      }
    }

    onUpdateEditedUser(
      pickedUser[0],
      editedUserData,
      localStorage.getItem('token')
    );

    this.setState({ editing: false });
  };

  checkValidity = (value, rules) => {
    let isValid = true;
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.mailFormat) {
      isValid = value.match(mailFormat);
    }

    return isValid;
  };

  onChangeHandler = (event, inputType) => {
    const { editedUserState } = this.state;

    const updatedUser = {
      ...editedUserState,
      [inputType]: {
        ...editedUserState[inputType],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          editedUserState[inputType].validation
        ),
        touched: true,
      },
    };

    this.setState({ editedUserState: updatedUser });
  };

  render() {
    const { allMatches, editedUser } = this.props;
    const { editedUserState, editing } = this.state;

    let users = <Spinner></Spinner>;

    if (allMatches.length) {
      users = allMatches.map((user) => (
        <div key={user.userId}>
          <Match
            clickHandler={() => {
              this.onClickHandler(user);
            }}
            isAdminView={true}
            id={user.userId}
            email={user.email}
            firstName={user.firstName}
            lastName={user.lastName}
          ></Match>
        </div>
      ));
    }

    return (
      <>
        <div className="Admin-Wrapper">
          {users}
          <Modal show={editing} closed={this.onEditingCancelHandler}>
            <p className={'Admin-Modal-Header'}>
              <strong>Proceed with editing or deleting the User </strong>
            </p>
            <form>
              <p>
                <strong>First Name:</strong> {editedUser.firstName}
              </p>

              <input
                className={'input-label'}
                value={editedUserState.firstName.value}
                type="text"
                id="firstName"
                name="firstName"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder="NEW First Name"
              ></input>

              <p>
                <strong>Last Name:</strong> {editedUser.lastName}
              </p>

              <input
                className={'input-label'}
                value={editedUserState.lastName.value}
                type="text"
                id="lastName"
                name="lastName"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder="NEW Last Name"
              ></input>

              <p>
                <strong>Location:</strong> {editedUser.location}
              </p>
              <input
                className={'input-label'}
                value={editedUserState.location.value}
                type="text"
                id="location"
                name="location"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder="NEW Location"
              ></input>
            </form>
            <button
              className={'Admin-Modal-Eddit-Button'}
              onClick={this.onEditConfirmHandler}
            >
              Save
            </button>
            <button
              className={'Admin-Modal-Delete-Button'}
              onClick={this.onDeleteUserHandler}
            >
              Delete
            </button>
          </Modal>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allUsers: state.admin.allUsers,
    allMatches: state.matches.matches,
    editedUser: state.admin.editedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteUser: (userId, token) =>
      dispatch(actions.deleteUserFromDb(userId, token)),
    onSetEditedUser: (editedUser) =>
      dispatch(actions.setEditedUser(editedUser)),
    onUpdateEditedUser: (editedUserId, editedUserData, token) =>
      dispatch(actions.updateEditedUser(editedUserId, editedUserData, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
