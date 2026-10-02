function UnAuthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-7xl font-extrabold text-[var(--primary-color)]">
                    401
                </h1>

                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                    Unauthorized
                </h2>

                <p className="mt-2 text-gray-500">
                    Your session has expired or you are not authorized.
                </p>

                <a
                    href="/login"
                    className="mt-6 inline-block rounded-lg bg-[var(--primary-color)] cursor-pointer px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                    Go to Login
                </a>
            </div>
        </div>
    );
}

export default UnAuthorized;