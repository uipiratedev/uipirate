// const Loader = () => {
//   return (
//     <>
//       <div
//         className="w-full h-screen flex flex-row items-center justify-center absolute top-0 bg-white"
//         style={{ zIndex: 9999999999999999999 }}
//       >
//         <div className="spinner">
//           <span />
//           <span />
//           <span />
//           <span />
//           <span />
//           <span />
//           <span />
//           <span />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Loader;



const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="reveal-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="reveal-bar"
            style={{ animationDelay: `${i * 0.01}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;


