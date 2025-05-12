import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // state to manage the edit alert modal
  const [openEditAlert, setOpenEditAlert] = useState({
    show: false,
    data: null,
  });

  // to check if modal windows is open or not, initially set to false
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // Get  all Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  // toast is used to show small pop up messages to user
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    //Validation checks
    // trim removes whitespaces from both ends of a string
    if (!source.trim()) {
      toast.error("Source is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
      toast.error("Error deleting income");
    }
  };

  const handleEditIncome = async (income) => {
    // destructure the income object to get the values
    const { _id, source, amount, date, icon } = income;

    //Validation checks
    // trim removes whitespaces from both ends of a string
    if (!source.trim()) {
      toast.error("Source is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(_id), {
        source,
        amount,
        date,
        icon,
      });

      toast.success("Income updated successfully");
      setOpenEditAlert({ show: false, data: null }); // close modal
      fetchIncomeDetails(); // refresh the list
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Error updating income");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              // send function to open modal
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onEdit={(id) => {
              setOpenEditAlert({ show: true, data: id });
            }}
          />
        </div>

        {/* Modal for Add Income */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          {/* when button is clicked, it will run the function that is passed to it */}
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Modal for Delete Income */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>

        {/* Modal for Edit Income */}
        <Modal
          isOpen={openEditAlert.show}
          onClose={() => setOpenEditAlert({ show: false, data: null })}
          title="Edit Income"
        >
          <AddIncomeForm
            onAddIncome={handleEditIncome}
            initialData={incomeData.find(
              (item) => item._id === openEditAlert.data
            )}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
