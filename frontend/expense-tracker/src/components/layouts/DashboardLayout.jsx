import React, { useEffect, useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { useUserAuth } from "../../hooks/useUserAuth";

import moment from "moment";
import emailjs from "@emailjs/browser";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const DashboardLayout = ({ children, activeMenu }) => {
  useUserAuth();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      checkDeadlineReminders(user);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );
  }

  const checkDeadlineReminders = async (user) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SAVINGS.GET_ALL_SAVING_GOALS
      );
      const goals = response.data;

      const reminderDays = [7, 3, 1, 0];
      const today = moment();

      for (const goal of goals) {
        const daysLeft = moment(goal.targetDate)
          .startOf("day")
          .diff(today.startOf("day"), "days");

        const alreadySent = goal.deadlineRemindersSent || [];

        const needsReminder =
          reminderDays.includes(daysLeft) &&
          !alreadySent.includes(daysLeft) &&
          goal.savedAmount < goal.targetAmount;

        if (needsReminder) {
          await emailjs.send(
            import.meta.env.VITE_2EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_DEADLINE_TEMPLATE_ID,
            {
              user_name: user.fullName,
              user_email: user.email,
              goal_title: goal.title,
              target_date: moment(goal.targetDate).format("MMMM Do, YYYY"),
              days_left: daysLeft,
              saved_amount: goal.savedAmount.toLocaleString(),
              target_amount: goal.targetAmount.toLocaleString(),
            },
            import.meta.env.VITE_2EMAILJS_PUBLIC_KEY
          );

          await axiosInstance.patch(
            API_PATHS.SAVINGS.PATCH_SAVING_GOAL(goal._id),
            { day: daysLeft }
          );

          console.log(
            `📧 Reminder email sent for "${goal.title}" — ${daysLeft} days left`
          );
        }
      }
    } catch (error) {
      console.error("Error in checkDeadlineReminders:", error);
    }
  };

  return (
    <div className="background">
      <Navbar activeMenu={activeMenu} />
      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
        <div className="mx-5 grow">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
