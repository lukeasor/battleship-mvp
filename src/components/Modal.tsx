interface ModalProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
  buttonText?: string
}

export function Modal({ isOpen, title, message, onClose, buttonText = 'OK' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
