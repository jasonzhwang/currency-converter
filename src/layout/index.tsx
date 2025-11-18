import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer/Footer";
import { useSession } from "next-auth/react";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  return (
    <>
      <Header session={session} />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default Layout;
