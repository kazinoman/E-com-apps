import { Container } from "@/components/common/Container";
import { ProfileSidebar } from "@/components/common/ProfileSidebar";
import React from "react";
import { requireUser } from "@/lib/auth-server";

/**
 * Every route in this group is customer-only.
 *
 * The guard runs on the server, before any markup is produced. Guarding in a
 * client effect instead would ship the protected page to the browser and only
 * then redirect, which leaks whatever was rendered and flashes it on screen.
 */
const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireUser();

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
