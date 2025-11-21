import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Layout Container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={handleSidebarClose}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onMenuToggle={handleMenuToggle}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;