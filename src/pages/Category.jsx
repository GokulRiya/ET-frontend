import { useEffect, useState } from "react"
import { getCategorys, createCategory, getCategoryById, updateCategory, deleteCategory } from "../services/categoryService"
import { toast } from 'react-toastify'
import { FaPlusCircle } from "react-icons/fa"
import { RiEdit2Fill } from "react-icons/ri"
import { MdDelete, MdCategory } from "react-icons/md"
import { FaSearch } from "react-icons/fa"

function Category() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
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
        const timer = setTimeout(() => {
            fetchCategory(searchCategory);
        }, 500); // Debounce search requests

        return () => {
            clearTimeout(timer);
        };
    }, [searchCategory]);

    // Handle form submit for adding a Category
    const handleSubmit = async (e) => {
        e.preventDefault();
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
            fetchCategory();
        } catch (error) {
            toast.error(error.response?.data?.message || (editCategory ? "Failed to update Category" : "Failed to add Category"));
        }
    };

    // Edit Category
    const handleEdit = async (e) => {
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
        }
    }

    // Delete Category
    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully!");
            fetchCategory();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete Category");
        }

    }
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
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
                    className="inline-flex items-center justify-center rounded-lg bg-(--primary-color) cursor-pointer px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-(--secondary-color) transition duration-200"
                >
                    <FaPlusCircle size={19} className="pointer-events-none mr-2" /> Add Category
                </button>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{editCategory ? 'Edit Category' : 'New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700">Category Name</label>
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">
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

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button"
                                    onClick={() => { setShowModal(false); setEditCategory(null); }}
                                    className="rounded-lg border border-slate-200 cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    Cancel</button>
                                <button type="submit"
                                    className="rounded-lg bg-(--primary-color) cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-(--secondary-color)">
                                    {editCategory ? 'Update Category' : 'Save Category'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table Container with modern shadows & rounding */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        {/* Table Header */}
                        <thead className="bg-gray-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4">Category</th>
                                <th scope="col" className="px-6 py-4">Type</th>
                                <th scope="col" className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500" role="status">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                                            <span>Loading categories...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : category && category.length > 0 ? (
                                category.map((value, index) => (
                                    <tr key={index} className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/50">

                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200">
                                            {value.categoryName}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200 capitalize">
                                            {value.type}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-2.5 flex justify-center gap-4">
                                            <RiEdit2Fill onClick={() => handleEdit(value)} size={19} title="Edit" className="cursor-pointer text-purple-500 hover:text-purple-700" />
                                            <MdDelete onClick={() => handleDelete(value._id)} size={19} title="Delete" className="cursor-pointer text-red-500 hover:text-red-700" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Empty State */
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-sm text-slate-400">
                                        No Category found.
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
