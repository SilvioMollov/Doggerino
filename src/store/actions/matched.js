// import * as actionTypes from './actionTypes'
// import axios from "axios"

// // export const setLikedUsers = (matches, allLikedUsers, userId) => {
// //     return {
// //         type:  actionTypes.SET_LIKED_USERS,
// //         matches: matches,
// //         likedUsersIds: allLikedUsers,
// //         userId: userId
// //     }
// // }

// // export const fetchAllUserData = (token, matches, userId) => {
// //     console.log(token, matches)
// //     return (dispatch) => {
// //         axios.get(
// //             `https://doggerino-79ffd.firebaseio.com/userData.json/?auth=${token}`
// //         )
// //         .then(response => {
// //             console.log("[FetchAllUserData]", response)
// //             // figure out where to dispatch this 
// //             dispatch(setLikedUsers(matches, response.data, userId))
// //         })
// //         .catch(error => {
// //             console.log("[FetchAllUserData]", error);
// //         })
// //     }
// // }