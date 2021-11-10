import "./style.css";

const Index = ({
  children,
  secondary = false,
  responsive = false,
  disabled,
  ...props
}) => {
  return (
    <>
      <button
        className={`capitalize py-2.5 px-8 text-sm font-medium  rounded-full 
        ${responsive ? "hidden md:block" : null}
        ${
          secondary
            ? "bg-primary text-white w-full py-3.5"
            : "bg-secondary text-primary"
        }
        
        `}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default Index;
