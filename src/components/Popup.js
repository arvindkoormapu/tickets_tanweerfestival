const Popup = ({ isOpen, children, width }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-opacity-50 bg-gray flex items-center justify-center transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`max-w-[450px]  bg-white p-4 rounded-lg shadow-lg ${width}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
