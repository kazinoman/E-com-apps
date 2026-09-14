import { Container } from "@/components/common/Container";
import { ProfileSidebar } from "@/components/common/ProfileSidebar";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 py-8">
        {/* Left Grid (4 columns on desktop) */}
        <div className="lg:col-span-3">
          <ProfileSidebar />
        </div>

        {/* Right Grid (8 columns on desktop) */}
        <div className="lg:col-span-9">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default ProfileLayout;
