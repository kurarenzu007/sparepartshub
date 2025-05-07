import React from 'react';
 import { Link } from 'react-router-dom';
 import '../styles/Breadcrumb.css';
 
 const Breadcrumb = ({ items }) => {
   return (
     <div className="breadcrumb">
       {items.map((item, index) => (
         <React.Fragment key={index}>
           {index > 0 && <span className="breadcrumb-separator">/</span>}
           {item.link ? (
             <Link to={item.link} className="breadcrumb-link">
               {item.label}
             </Link>
           ) : (
             <span className="breadcrumb-text">{item.label}</span>
           )}
         </React.Fragment>
       ))}
     </div>
   );
 };
 
 export default Breadcrumb; 