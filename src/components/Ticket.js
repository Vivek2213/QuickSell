import React from "react";
import CardComponent from "./Card";

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Ticket = ({ ticket , userMap}) => {
  const { title, status, priority, userId} = ticket;

  function getUserName(str) {
    for (let i = 0; i < userMap.length; i++) {
      if (userMap[i].id === str) {
        return  userMap[i].name
      }
    }
  }
  return (
    <CardComponent
      title={title}
      description={
        <>
          <span>
            <CheckCircleOutlined
              style={{ marginRight: "5px", color: "#52c41a" }}
            />
            Status: {status}
          </span>
          <br />
          <span>
            <ExclamationCircleOutlined
              style={{ marginRight: "5px", color: "#faad14" }}
            />
            Priority: {priority}
          </span>
          <br />
          <span>
            <UserOutlined style={{ marginRight: "5px" }} />
            Assigned to: {getUserName(userId)}
          </span>
        </>
      }
    />
  );
};

export default Ticket;
