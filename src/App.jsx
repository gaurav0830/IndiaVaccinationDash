import React from "react";
import SidebarDemo from "@/components/SidebarDemo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex items-start justify-center">
        <SidebarDemo />
      </div>
    </QueryClientProvider>
  );
}

export default App;
