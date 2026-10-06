import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { getCategorys, createCategory, getCategoryById, updateCategory, deleteCategory } from "../services/categoryService"
import { toast } from 'react-toastify'
import { FaPlusCircle } from "react-icons/fa"
import { RiEdit2Fill } from "react-icons/ri"
import { MdDelete, MdCategory } from "react-icons/md"
import { FaSearch } from "react-icons/fa"

function Category() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const actionLock = useRef(false);
    const submitLock = useRef(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ categoryName: '', type: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [searchCategory, setSearchCategory] = useState('');

    // Fetch Category
    const fetchCategory = async (search = "") => {
        setLoading(true);
        try {
            const response = await getCategorys(search);

            if (response && response.data) {
                setCategory(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Fetch failed!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchCategory != "") {
            const timer = setTimeout(() => {
                fetchCategory(searchCategory);
            }, 500); // Debounce search requests

            return () => {
                clearTimeout(timer);
            };
        } else {
            fetchCategory(searchCategory);
        }
    }, [searchCategory]);

    // Handle form submit for adding a Category
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || submitLock.current) return;
        submitLock.current = true;
        setLoading(true);
        try {
            let response;
            if (editCategory) {
                response = await updateCategory(editCategory._id, newCategory);
            } else {
                response = await createCategory(newCategory);
            }
            if (!response.success) {
                toast.error(response.message || "Category already exists");
                return;
            }
            toast.success(editCategory ? "Category updated successfully!" : "Category added successfully!");
            setShowModal(false);
            setEditCategory(null);
            setNewCategory({ categoryName: '', type: '' });
            await fetchCategory();
        } catch (error) {
            toast.error(error.response?.data?.message || (editCategory ? "Failed to update Category" : "Failed to add Category"));
        } finally {
            submitLock.current = false;
            setLoading(false);
        }
    };

    // Edit Category
    const handleEdit = async (e) => {
        if (actionLock.current) return;
        actionLock.current = true;
        setActionBusy(true);
        setEditLoading(true);
        try {
            const response = await getCategoryById(e._id);
            const data = response.data;
            setEditCategory(data);
            setShowModal(true);
            setNewCategory({
                categoryName: data.categoryName,
                type: data.type
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load Category");
        } finally {
            actionLock.current = false;
            setActionBusy(false);
            setEditLoading(false);
        }
    }

    // Delete Category
    const handleDelete = (id) => {
        setDeleteCategoryId(id);
    }

    const confirmDelete = async () => {
        if (!deleteCategoryId || actionLock.current) return;
        actionLock.current = true;
        setActionBusy(true);
        try {
            await deleteCategory(deleteCategoryId);
            toast.success("Category deleted successfully!");
            setDeleteCategoryId(null);
            await fetchCategory();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete Category");
        } finally {
            actionLock.current = false;
            setActionBusy(false);
        }
    }
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen overall-bg">
            {/* Header Section */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Category</h1>
                <p className="mt-1 text-sm text-slate-500">Manage categories registered under your administration.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-4 mb-4">
                {/* Button to trigger Add Category Modal */}
                <div>
                    <div className="relative">
                        <FaSearch size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            placeholder="Search category, type"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditCategory(null);
                        setNewCategory({ categoryName: '', type: '' });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-(--primary-color) cursor-pointer px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-(--secondary-color) transition duration-200"
                >
                    <FaPlusCircle size={19} className="pointer-events-none mr-2" /> Add Category
                </button>
            </div>

            {editLoading && createPortal((
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" role="status" aria-live="polite">
                    <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl">
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                        <span className="text-sm font-medium text-slate-700">Loading category...</span>
                    </div>
                </div>
            ), document.body)}

            {deleteCategoryId && createPortal((
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-category-title">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        {actionBusy ? (
                            <div className="flex items-center justify-center gap-3 py-2" role="status" aria-live="polite">
                                <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                                <span className="text-sm font-medium text-slate-700">Deleting category...</span>
                            </div>
                        ) : (
                            <>
                                <h2 id="delete-category-title" className="text-lg font-semibold text-slate-900">
                                    Delete this category?
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    This will permanently remove the category. You won't be able to get it back.
                                </p>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => setDeleteCategoryId(null)} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">No, cancel</button>
                                    <button type="button" onClick={confirmDelete} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Yes, delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ), document.body)}

            {/* Modal Overlay */}
            {showModal && createPortal((
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 h-screen">
                    <div className="flex w-full min-w-0 max-w-md flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl max-h-[90dvh]">
                        <div className="shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6">
                            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{editCategory ? 'Edit Category' : 'New Category'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">

                                <div>
                                    <label
                                        className="mb-1 block text-sm font-medium text-gray-700">Category Name</label>
                                    <div className="relative">
                                        <MdCategory size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input type="text"
                                            value={newCategory.categoryName}
                                            onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                                            placeholder="Enter your category name"
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Type
                                    </label>

                                    <select
                                        value={newCategory.type}
                                        onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
                                    >
                                        <option value="">
                                            Select your type
                                        </option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>

                                </div>

                            </div>
                            <div className="shrink-0 flex flex-col-reverse gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
                                <button type="button"
                                    onClick={() => { setShowModal(false); setEditCategory(null); }}
                                    className="w-full rounded-lg border border-slate-200 cursor-pointer px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto">
                                    Cancel</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto cursor-pointer rounded-lg bg-(--primary-color) px-4 py-1.5 text-sm font-medium text-white hover:bg-(--secondary-color) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? 'Please wait...' : editCategory ? 'Update Category' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ), document.body)}

            {/* Table Container with modern shadows & rounding */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        {/* Table Header */}
                        <thead className="bg-gray-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Category</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Type</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="p-6 text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500" role="status">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                                            <span>Loading categories...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : category && category.length > 0 ? (
                                category.map((value, index) => (
                                    <tr key={index} className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/50">

                                        <td className="whitespace-nowrap px-6 py-1.5 font-medium text-slate-900 dark:text-slate-200">
                                            {value.categoryName ? value.categoryName : "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-1.5 font-medium text-slate-900 dark:text-slate-200 capitalize">
                                            {value.type ? value.type : "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-1.5 flex justify-center gap-4">
                                            <button type="button" onClick={() => handleEdit(value)} disabled={actionBusy} aria-label="Edit category" title="Edit" className="p-1.5 rounded-2xl cursor-pointer text-indigo-500 hover:bg-gray-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-50">
                                                <RiEdit2Fill size={19} />
                                            </button>
                                            <button type="button" onClick={() => handleDelete(value._id)} disabled={actionBusy} aria-label="Delete category" title="Delete" className="p-1.5 rounded-2xl cursor-pointer text-red-500 hover:bg-gray-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-50">
                                                <MdDelete size={19} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Empty State */
                                <tr>
                                    <td className="p-6 text-sm text-slate-400">
                                        No Categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Category;
