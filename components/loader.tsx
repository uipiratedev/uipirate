const Loader = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <>
      <div
        className={`w-full h-screen flex flex-row items-center justify-center fixed top-0 left-0 ${
          isAdmin 
            ? "bg-white/10 backdrop-blur-[6px]" 
            : "bg-white"
        }`}
        style={{ zIndex: 9999999999999999999 }}
      >
        <div className="spinner">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  );
};

export default Loader;



// const Loader = () => {
//   return (
//     <div className="loader-wrapper">
//       <div className="reveal-container">
//         {Array.from({ length: 12 }).map((_, i) => (
//           <div
//             key={i}
//             className="reveal-bar"
//             style={{ animationDelay: `${i * 0.01}s` }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Loader;


