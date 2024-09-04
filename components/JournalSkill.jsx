// "use client";

// import { useState, useEffect } from "react";
// import data from "@emoji-mart/data";
// import { init } from "emoji-mart";
// import { FaBoltLightning } from "react-icons/fa6";

// init({ data });

// const JournalSkill = ({ habitWillpower = {} }) => {
//   const [habitDetails, setHabitDetails] = useState({});
//   // const [loading, setLoading] = useState({});

//   const habitIdList = Object.keys(habitWillpower);

//   const getHabitDetails = async (id) => {
//     try {
//       // setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));

//       const response = await fetch(`api/habit/${id}`);
//       const habitData = await response.json();

//       setHabitDetails((prevDetails) => ({
//         ...prevDetails,
//         [id]: habitData.icon,
//       }));
//     } catch (error) {
//       console.error("Error fetching habit details:", error);
//     } finally {
//       // setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
//     }
//   };

//   useEffect(() => {
//     const fetchHabitDetails = async () => {
//       const promises = habitIdList.map((id) => getHabitDetails(id));
//       await Promise.all(promises);
//     };

//     fetchHabitDetails();
//   }, []);

//   return (
//     <div className="flex items-center space-x-4 h-16">
//       {Object.entries(habitWillpower).map(([id, willpower]) => {
//         if (!id || !habitDetails[id]) return null;
//         return (
//           <>
//             {/* {loading[id] ? (
//               <div className="w-full h-full flex justify-center items-center">
//                 <div className="loader" />
//               </div>
//             ) : ( */}
//             <div key={id} className="flex items-center">
//               <em-emoji shortcodes={habitDetails[id]} size="2rem" />
//               <span className="ml-1 text-lg flex items-center">
//                 + {willpower} <FaBoltLightning size="0.8rem" />
//               </span>
//             </div>
//             {/* )} */}
//           </>
//         );
//       })}
//     </div>
//   );
// };

// export default JournalSkill;
