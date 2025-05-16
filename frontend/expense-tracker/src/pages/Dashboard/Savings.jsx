import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SavingsOverview from "../../components/Savings/SavingsOverview";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/layouts/Modal";
import axiosInstance from "../../utils/axiosInstance";
import AddSavingGoalForm from "../../components/Savings/AddSavingGoalForm";
import toast from "react-hot-toast";
import GoalsList from "../../components/Savings/GoalsList";
import ExpandGoalDetailsForm from "../../components/Savings/ExpandGoalDetailsForm";

const Savings = () => {
  const [savingGoalsData, setSavingGoalsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalSavingsAmount, setTotalSavingsAmount] = useState(0);

  const [openAddSavingGoalModal, setOpenAddSavingGoalModal] = useState(false);

  const [openExpandAlert, setOpenExpandAlert] = useState(false); // Alert to check state of ExpandGoalDetailsForm

  const [selectedGoal, setSelectedGoal] = useState(null); // To be used in ExpandGoalDetailsForm

  const fetchSavingGoals = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.SAVINGS.GET_ALL_SAVING_GOALS}`
      );

      if (response.data) {
        setSavingGoalsData(response.data);
        setTotalSavingsAmount(
          response.data.reduce((sum, goal) => sum + goal.savedAmount, 0)
        );
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Saving Goal
  const handleAddSavingGoal = async (goal) => {
    const { title, targetAmount, targetDate, icon } = goal;

    // Validation checks
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
      toast.error("Target amount should be a valid number greater than 0.");
      return;
    }

    if (!targetDate) {
      toast.error("Target date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.SAVINGS.ADD_SAVING_GOAL, {
        title,
        targetAmount,
        targetDate,
        icon,
      });

      setOpenAddSavingGoalModal(false);
      toast.success("Saving goal added successfully!");
      fetchSavingGoals(); // refresh list
    } catch (error) {
      console.error(
        "Error adding saving goal: ",
        error.response?.data?.message || error.message
      );
      toast.error("Something went wrong while adding the saving goal.");
    }
  };

  useEffect(() => {
    fetchSavingGoals();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Savings">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <SavingsOverview
            totalSavingsAmount={totalSavingsAmount}
            onAddSavingGoal={() => setOpenAddSavingGoalModal(true)}
          />
        </div>

        {/* Saving Goals List */}
        <GoalsList
          goals={savingGoalsData}
          onExpand={(goal) => {
            setSelectedGoal(goal);
            setOpenExpandAlert(true);
          }}
        />

        {/* Modal for Add Saving Goal */}
        <Modal
          isOpen={openAddSavingGoalModal}
          onClose={() => setOpenAddSavingGoalModal(false)}
          title="Add Saving Goal"
        >
          <AddSavingGoalForm onAddSavingGoal={handleAddSavingGoal} />
        </Modal>

        {/* Modal for Expand Goal */}
        <Modal
          key={selectedGoal?._id} // This forces remounting when _id changes
          isOpen={openExpandAlert}
          onClose={() => {
            setOpenExpandAlert(false);
            fetchSavingGoals(); // refresh goal lists after closing modal
          }}
          title="Goal Details"
        >
          <ExpandGoalDetailsForm
            goal={selectedGoal}
            setGoal={setSelectedGoal}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Savings;
