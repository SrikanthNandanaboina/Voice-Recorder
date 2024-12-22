const Button = ({ text, backgroundColor, callback, disabled }) => {
  return (
    <button
      style={{
        backgroundColor: disabled ? 'gray' : backgroundColor,
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: 'pointer'
      }}
      onClick={callback}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button