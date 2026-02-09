interface DeleteAccountModalProps {
  show: boolean;
  confirmText: string;
  error: string;
  loading: boolean;
  onConfirmTextChange: (value: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteAccountModal({
  show,
  confirmText,
  error,
  loading,
  onConfirmTextChange,
  onDelete,
  onClose,
}: DeleteAccountModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Account?</h3>
        </div>

        <p className="text-gray-600 mb-4">
          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800 font-medium mb-2">
            The following will be deleted:
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• All your notes</li>
            <li>• Your account information</li>
            <li>• All associated data</li>
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => onConfirmTextChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="DELETE"
            disabled={loading}
          />
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={loading || confirmText !== "DELETE"}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
