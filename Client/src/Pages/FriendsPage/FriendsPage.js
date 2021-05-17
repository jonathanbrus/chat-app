import React, { useState } from "react";
import { motion } from "framer-motion";
import { connect } from "react-redux";

import FriendListItem from "../../Components/FriendListItem/FriendListItem";
import SearchModal from "../../Components/SearchModal/SearchModal";
import classes from "./FriendsPage.module.css";
import { addFriend } from "../../SVGs";
import { Loader } from "../../Components/UI/Loader/Loader";

const FriendsPage = (props) => {
  const [value, setValue] = useState("");

  const [toggle, setToggle] = useState(false);

  let friends;

  if (value) {
    friends = props.friends.filter(
      (friend) => friend.userName.match(new RegExp(value, "i")) && friend
    );
  } else {
    friends = props.friends;
  }

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{}}
      transition={{ type: "spring", damping: 12 }}
      className={classes.FriendsPage}
    >
      <section className={classes.TopSection}>
        <div className={classes.PageHeader}>Friends</div>
        <div className={classes.SearchContainer}>
          <input
            type="text"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Search by username"
          />
          <button onClick={() => setToggle(true)}>{addFriend}</button>
        </div>
      </section>
      {toggle && <SearchModal setToggle={() => setToggle(false)} />}
      <section className={classes.FriendsList}>
        {props.friends.length ? (
          friends.length ? (
            friends.map((friend) => (
              <FriendListItem key={friend._id} friend={friend} />
            ))
          ) : (
            <Loader message="There is no result for the search." />
          )
        ) : (
          <Loader message="You don't have friends yet, add more friends!" />
        )}
      </section>
    </motion.div>
  );
};

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
    friends: state.Friends.friends,
  };
};

export default connect(mapStateToProps)(FriendsPage);
