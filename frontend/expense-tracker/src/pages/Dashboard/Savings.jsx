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
import DeleteAlert from "../../components/layouts/DeleteAlert";

const Savings = () => {
  const [savingGoalsData, setSavingGoalsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalSavingsAmount, setTotalSavingsAmount] = useState(0);

  const [openAddSavingGoalModal, setOpenAddSavingGoalModal] = useState(false);

  const [openExpandAlert, setOpenExpandAlert] = useState(false); // Alert to check state of ExpandGoalDetailsForm

  const [selectedGoal, setSelectedGoal] = useState(null); // To be used in ExpandGoalDetailsForm

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // state to manage the edit alert modal
  const [openEditAlert, setOpenEditAlert] = useState({
    show: false,
    data: null,
  });

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
      toast.error("Failed to load saving goals");
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

  // Handle Delete Saving Goal
  const deleteSavingGoal = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.SAVINGS.DELETE_SAVING_GOAL(id));

      setOpenDeleteAlert({ show: false, data: null }); // Optional: close modal if using one
      toast.success("Saving goal deleted successfully");
      fetchSavingGoals(); // Refresh
    } catch (error) {
      console.error(
        "Error deleting saving goal:",
        error.response?.data?.message || error.message
      );
      toast.error("Error deleting saving goal");
    }
  };

  // Handle Edit Saving Goal
  const handleEditSavingGoal = async (goal) => {
    const { _id, title, targetAmount, targetDate, icon } = goal;

    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
      toast.error("Target amount should be a valid number greater than 0.");
      return;
    }

    if (!targetDate) {
      toast.error("Target date is required");
      return;
    }

    try {
      await axiosInstance.put(API_PATHS.SAVINGS.UPDATE_SAVING_GOAL(_id), {
        title,
        targetAmount,
        targetDate,
        icon,
      });

      toast.success("Saving goal updated successfully");

      // Close modal (if you're using the same modal for add/edit)
      setOpenEditAlert({ show: false, data: null });

      // Refresh the list
      fetchSavingGoals();
    } catch (error) {
      console.error("Error updating saving goal:", error);
      toast.error("Error updating saving goal");
    }
  };

  useEffect(() => {
    fetchSavingGoals();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Savings">
      <div className="mx-auto my-5">
        <div className="grid grid-cols-1 gap-6 my-5">
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
          onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id });
          }}
          onEdit={(id) => {
            setOpenEditAlert({ show: true, data: id });
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

        {/* Model for Deleting Saving Goal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Saving Goal"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Saving Goal?"
            onDelete={() => deleteSavingGoal(openDeleteAlert.data)}
          />
        </Modal>

        {/* Modal for Edit Income */}
        <Modal
          isOpen={openEditAlert.show}
          onClose={() => setOpenEditAlert({ show: false, data: null })}
          title="Edit Saving Goal"
        >
          <AddSavingGoalForm
            onAddSavingGoal={handleEditSavingGoal}
            initialData={savingGoalsData.find(
              (item) => item._id === openEditAlert.data
            )}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Savings;
