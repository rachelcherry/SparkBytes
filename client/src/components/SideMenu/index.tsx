import React, { useState, useEffect } from "react";
import {
  LogoutOutlined,
  CalendarOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

function SideMenu() {
  const router = useRouter();
  const pathname = router.pathname;
  const [selectedKeys, setSelectedKeys] = useState(pathname);
  const { clearAuthState, getAuthState, authState } = useAuth();

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  const signOut = async () => {
<<<<<<< HEAD
=======
    // Added async for error handling
>>>>>>> 042c095a0bd9eeb5301994014da20d0711b7f876
    try {
      await clearAuthState();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="SideMenu">
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === "signOut") {
            signOut();
          } else {
            router.push(item.key);
          }
        }}
        selectedKeys={[selectedKeys]}
      >
        <Menu.Item key="/protected" icon={<HomeOutlined />}>
          Example Protected Route
        </Menu.Item>
        <Menu.Item key="/events" icon={<CalendarOutlined />}>
          Events
        </Menu.Item>
<<<<<<< HEAD
        {authState?.decodedToken?.canPostEvents && (
=======
        {authState?.decodedToken?.id && (
>>>>>>> 042c095a0bd9eeb5301994014da20d0711b7f876
          <Menu.Item key="/events/create" icon={<PlusOutlined />}>
            Create Event
          </Menu.Item>
        )}
<<<<<<< HEAD
      </Menu>
      <div style={{ marginTop: "auto" }}>
        <Menu mode="vertical" onClick={signOut} selectedKeys={[]}>
          <Menu.Item key="signOut" icon={<LogoutOutlined />}>
            Sign Out
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
}

export default SideMenu;
=======
        <Menu.Item key="signOut" icon={<LogoutOutlined />}>
          Sign Out
        </Menu.Item>
      </Menu>
    </div>
  );
}
export default SideMenu;
>>>>>>> 042c095a0bd9eeb5301994014da20d0711b7f876
