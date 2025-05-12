import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/layouts/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
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
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Get  all Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    //Validation checks
    // trim removes whitespaces from both ends of a string
    if (!category.trim()) {
      toast.error("Category is required");
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
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
      toast.error("Error deleting expense");
    }
  };

  const handleEditExpense = async (expense) => {
    // destructure the expense object to get the values
    const { _id, category, amount, date, icon } = expense;

    //Validation checks
    // trim removes whitespaces from both ends of a string
    if (!category.trim()) {
      toast.error("Category is required");
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
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(_id), {
        category,
        amount,
        date,
        icon,
      });

      toast.success("Expense updated successfully");
      setOpenEditAlert({ show: false, data: null }); // close modal
      fetchExpenseDetails(); // refresh the list
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Error updating expense");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          />
        </div>

        <ExpenseList
          transactions={expenseData}
          onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id });
          }}
          onEdit={(id) => {
            setOpenEditAlert({ show: true, data: id });
          }}
        />
      </div>

      {/* Modal for Add Expense */}
      <Modal
        isOpen={openAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title="Add Expense"
      >
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </Modal>

      {/* Modal for Delete Expense */}
      <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Delete Expense"
      >
        <DeleteAlert
          content="Are you sure you want to delete this expense?"
          onDelete={() => deleteExpense(openDeleteAlert.data)}
        />
      </Modal>

      {/* Modal for Edit Expense */}
      <Modal
        isOpen={openEditAlert.show}
        onClose={() => setOpenEditAlert({ show: false, data: null })}
        title="Edit Expense"
      >
        <AddExpenseForm
          onAddExpense={handleEditExpense}
          initialData={expenseData.find(
            (item) => item._id === openEditAlert.data
          )}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Expense;
