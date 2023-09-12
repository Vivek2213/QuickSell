import React, { useState, useEffect } from "react";
import Column from "./Column";
import { Select, Button } from "antd";
import "antd/dist/reset.css";
import "./Board.css";
import axios from "axios";

const { Option } = Select;

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [userMap, setUserMap] = useState([]);
  const [groupingOption, setGroupingOption] = useState(
    localStorage.getItem("groupingOption") || "status"
  );
  const [sortedBy, setSortedBy] = useState(
    localStorage.getItem("sortedBy") || "priority"
  );
  
  useEffect(() => {
    async function fetchData() {
      const data = (await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment")).data;
      setUserMap(data.users);
      setTickets(data.tickets);
    }
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("groupingOption", groupingOption);
  }, [groupingOption]);

  function getUserName(str) {
    for (let i = 0; i < userMap.length; i++) {
      if (userMap[i].id === str) {
        return  userMap[i].name
      }
    }
  }
  useEffect(() => {
    localStorage.setItem("sortedBy", sortedBy);
  }, [sortedBy]);

  const groupTicketsByOption = (tickets, option) => {
    const groupedTickets = {};

    tickets.forEach((ticket) => {
      // Loop through tickets
      const key =
        option === "status"
          ? ticket.status
          : option === "user"
          ? getUserName(ticket.userId)
          : ticket.priority;
      if (!groupedTickets[key]) {
        groupedTickets[key] = [];
      }
      groupedTickets[key].push(ticket);
    });

    return groupedTickets;
  };

  const sortTicketsByOption = (groupedTickets, option) => {
    const sortedTickets = {};

    Object.keys(groupedTickets).forEach((groupTitle) => {
      const group = groupedTickets[groupTitle];
      sortedTickets[groupTitle] =
        option === "priority"
          ? group.sort((a, b) => b.priority - a.priority)
          : group.sort((a, b) => a.title.localeCompare(b.title));
    });
    return sortedTickets;
  };
  console.log({tickets});
  console.log({sortedBy});

  console.log({groupingOption});
  const groupedTickets = groupTicketsByOption(tickets, groupingOption);
  const sortedTickets = sortTicketsByOption(groupedTickets, sortedBy);
  console.log({sortedTickets});
  return (
    <div className="kanban-board">
      <div className="options">
        <Select
          value={groupingOption}
          onChange={(value) => setGroupingOption(value)}
          style={{ width: 180, marginRight: 10 }}
        >
          <Option value="status">Group by Status</Option>
          <Option value="user">Group by User</Option>
          <Option value="priority">Group by Priority</Option>
        </Select>
        <Button onClick={() => setSortedBy("priority")} type="primary">
          Sort by Priority
        </Button>
        <Button onClick={() => setSortedBy("title")} type="primary">
          Sort by Title
        </Button>
      </div>
      <div className="board-columns">
        {Object.keys(sortedTickets).map((groupTitle) => (
          <Column
            key={groupTitle}
            title={groupTitle}
            tickets={sortedTickets[groupTitle]}
            userMap = {userMap}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
