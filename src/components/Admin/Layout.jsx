import React from 'react';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  return (
    <div className="w-full h-full flex">
      <SideBar />
      <div className="content flex-1 p-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;

